import makeWASocket, { DisconnectReason, useMultiFileAuthState, } from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import pino from 'pino';
import { ChannelService } from './channelService.js';
const SESSIONS_DIR = path.resolve(process.cwd(), 'whatsapp-sessions');
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}
export class WhatsAppManager {
    static instance;
    sockets = new Map();
    qrCodes = new Map();
    io = null;
    logger = pino({ level: 'silent' });
    constructor() { }
    static getInstance() {
        if (!WhatsAppManager.instance) {
            WhatsAppManager.instance = new WhatsAppManager();
        }
        return WhatsAppManager.instance;
    }
    setSocketIO(io) {
        this.io = io;
    }
    /**
     * Returns current session directory for a channel.
     */
    getSessionDir(channelId) {
        return path.join(SESSIONS_DIR, channelId);
    }
    /**
     * Initializes or restores a WhatsApp Web session for a channel.
     */
    async createSession(channelId) {
        if (this.sockets.has(channelId)) {
            const existingSocket = this.sockets.get(channelId);
            if (existingSocket) {
                return existingSocket;
            }
        }
        const sessionDir = this.getSessionDir(channelId);
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const socket = makeWASocket({
            auth: state,
            logger: this.logger,
            printQRInTerminal: false,
            browser: ['WHSend Gateway', 'Chrome', '1.0.0'],
        });
        this.sockets.set(channelId, socket);
        socket.ev.on('creds.update', saveCreds);
        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                try {
                    const qrDataUrl = await QRCode.toDataURL(qr);
                    this.qrCodes.set(channelId, qrDataUrl);
                    await ChannelService.updateChannelStatus(channelId, 'WAITING_FOR_QR');
                    if (this.io) {
                        this.io.emit('channel:qr', {
                            channelId,
                            qr: qrDataUrl,
                        });
                    }
                }
                catch (err) {
                    console.error(`[WA Session ${channelId}] QR Generation Error:`, err);
                }
            }
            if (connection === 'connecting') {
                await ChannelService.updateChannelStatus(channelId, 'CONNECTING');
                if (this.io) {
                    this.io.emit('channel:connecting', { channelId });
                }
            }
            if (connection === 'open') {
                this.qrCodes.delete(channelId);
                const rawUser = socket.user?.id || '';
                const phone = rawUser.split(':')[0] || rawUser.split('@')[0];
                const formattedPhone = phone ? `+${phone}` : null;
                await ChannelService.updateChannelStatus(channelId, 'CONNECTED', formattedPhone);
                if (this.io) {
                    this.io.emit('channel:connected', {
                        channelId,
                        status: 'CONNECTED',
                        whatsappNumber: formattedPhone,
                    });
                }
            }
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                this.sockets.delete(channelId);
                this.qrCodes.delete(channelId);
                if (statusCode === DisconnectReason.loggedOut) {
                    // Permanently logged out from phone
                    this.clearSessionFolder(channelId);
                    await ChannelService.updateChannelStatus(channelId, 'DISCONNECTED', null);
                    if (this.io) {
                        this.io.emit('channel:disconnected', { channelId });
                    }
                }
                else if (shouldReconnect) {
                    // Reconnect automatically if temporary disconnect
                    await ChannelService.updateChannelStatus(channelId, 'CONNECTING');
                    if (this.io) {
                        this.io.emit('channel:connecting', { channelId });
                    }
                    // Attempt reconnection after short pause
                    setTimeout(() => {
                        this.createSession(channelId).catch((err) => console.error(`[WA Session ${channelId}] Reconnect failed:`, err));
                    }, 3000);
                }
                else {
                    await ChannelService.updateChannelStatus(channelId, 'DISCONNECTED');
                    if (this.io) {
                        this.io.emit('channel:disconnected', { channelId });
                    }
                }
            }
        });
        return socket;
    }
    /**
     * Retrieves active QR code data URL if available.
     */
    getQRCode(channelId) {
        return this.qrCodes.get(channelId) || null;
    }
    /**
     * Checks if session is active and connected.
     */
    isConnected(channelId) {
        const socket = this.sockets.get(channelId);
        return !!(socket && socket.user);
    }
    /**
     * Destroys session, ends socket connection, and deletes stored auth credentials.
     */
    async destroySession(channelId) {
        const socket = this.sockets.get(channelId);
        if (socket) {
            try {
                socket.ev.removeAllListeners('connection.update');
                socket.ev.removeAllListeners('creds.update');
                await socket.logout().catch(() => { });
                socket.end(undefined);
            }
            catch (e) {
                // ignore disconnect errors
            }
            this.sockets.delete(channelId);
        }
        this.qrCodes.delete(channelId);
        this.clearSessionFolder(channelId);
        await ChannelService.updateChannelStatus(channelId, 'DISCONNECTED', null);
        if (this.io) {
            this.io.emit('channel:disconnected', { channelId });
        }
    }
    /**
     * Safely deletes local session folder on disk.
     */
    clearSessionFolder(channelId) {
        const sessionDir = this.getSessionDir(channelId);
        if (fs.existsSync(sessionDir)) {
            try {
                fs.rmSync(sessionDir, { recursive: true, force: true });
            }
            catch (err) {
                console.error(`Failed to remove session directory for ${channelId}:`, err);
            }
        }
    }
    /**
     * Sends a message through a channel's connected WhatsApp session.
     */
    async sendMessage(channelId, recipient, message) {
        const socket = this.sockets.get(channelId);
        if (!socket || !socket.user) {
            return { success: false, error: 'Channel is not connected' };
        }
        // Clean phone number: remove non-digits
        const cleanNumber = recipient.replace(/\D/g, '');
        if (!cleanNumber || cleanNumber.length < 8 || cleanNumber.length > 15) {
            return { success: false, error: 'Invalid recipient' };
        }
        const jid = `${cleanNumber}@s.whatsapp.net`;
        try {
            const result = await socket.sendMessage(jid, { text: message });
            const messageId = result?.key?.id || `msg_${Date.now()}`;
            // Log successful message in DB
            await ChannelService.logMessage(channelId, recipient, message, 'SENT', messageId);
            return {
                success: true,
                message_id: messageId,
            };
        }
        catch (error) {
            console.error(`[WA Send Error ${channelId}]:`, error);
            await ChannelService.logMessage(channelId, recipient, message, 'FAILED', undefined, error?.message || 'Failed to send message');
            return {
                success: false,
                error: error?.message || 'Failed to send message through WhatsApp',
            };
        }
    }
    /**
     * On server launch: restored sessions for existing channels.
     */
    async initializeStoredSessions() {
        try {
            const channels = await ChannelService.getAllChannels();
            for (const ch of channels) {
                const sessionDir = this.getSessionDir(ch.id);
                if (fs.existsSync(sessionDir) && fs.readdirSync(sessionDir).length > 0) {
                    console.log(`[WA Manager] Restoring persistent session for channel ${ch.name} (${ch.id})...`);
                    this.createSession(ch.id).catch((err) => console.error(`Failed to restore session for ${ch.id}:`, err));
                }
            }
        }
        catch (err) {
            console.error('[WA Manager] Error restoring stored sessions:', err);
        }
    }
}
