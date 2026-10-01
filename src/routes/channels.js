import { Router } from 'express';
import { ChannelService } from '../services/channelService.js';
import { WhatsAppManager } from '../services/whatsapp.js';
const router = Router();
/**
 * GET /api/channels
 * Fetch list of all channels
 */
router.get('/', async (req, res) => {
    try {
        const channels = await ChannelService.getAllChannels();
        const waManager = WhatsAppManager.getInstance();
        const result = channels.map((ch) => ({
            ...ch,
            qr: waManager.getQRCode(ch.id),
        }));
        res.json({ success: true, channels: result });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * POST /api/channels
 * Create a new WhatsApp Channel
 */
router.post('/', async (req, res) => {
    try {
        const { name } = req.body || {};
        if (!name || typeof name !== 'string' || !name.trim()) {
            res.status(400).json({ success: false, error: 'Channel name is required' });
            return;
        }
        const { channel, rawApiKey } = await ChannelService.createChannel(name.trim());
        const waManager = WhatsAppManager.getInstance();
        // Immediately trigger session creation for QR scanning
        waManager.createSession(channel.id).catch((err) => console.error(`Failed to start session for new channel ${channel.id}:`, err));
        res.status(201).json({
            success: true,
            channel,
            apiKey: rawApiKey, // Displayed ONLY ONCE upon creation
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * GET /api/channels/:id
 * Get channel details and current QR code if available
 */
router.get('/:id', async (req, res) => {
    try {
        const channelId = req.params.id;
        const channel = await ChannelService.getChannelById(channelId);
        if (!channel) {
            res.status(404).json({ success: false, error: 'Channel not found' });
            return;
        }
        const waManager = WhatsAppManager.getInstance();
        const qr = waManager.getQRCode(channel.id);
        res.json({
            success: true,
            channel: {
                ...channel,
                qr,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * POST /api/channels/:id/connect
 * Initiate or retry WhatsApp QR session connection
 */
router.post('/:id/connect', async (req, res) => {
    try {
        const channelId = req.params.id;
        const channel = await ChannelService.getChannelById(channelId);
        if (!channel) {
            res.status(404).json({ success: false, error: 'Channel not found' });
            return;
        }
        const waManager = WhatsAppManager.getInstance();
        await waManager.createSession(channel.id);
        res.json({
            success: true,
            message: 'Connection process initiated. Waiting for QR scan.',
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * POST /api/channels/:id/disconnect
 * Disconnect WhatsApp session
 */
router.post('/:id/disconnect', async (req, res) => {
    try {
        const channelId = req.params.id;
        const channel = await ChannelService.getChannelById(channelId);
        if (!channel) {
            res.status(404).json({ success: false, error: 'Channel not found' });
            return;
        }
        const waManager = WhatsAppManager.getInstance();
        await waManager.destroySession(channel.id);
        res.json({
            success: true,
            message: 'WhatsApp session disconnected successfully.',
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * POST /api/channels/:id/regenerate-key
 * Regenerates the API key for a channel
 */
router.post('/:id/regenerate-key', async (req, res) => {
    try {
        const channelId = req.params.id;
        const channel = await ChannelService.getChannelById(channelId);
        if (!channel) {
            res.status(404).json({ success: false, error: 'Channel not found' });
            return;
        }
        const newRawApiKey = await ChannelService.regenerateApiKey(channel.id);
        res.json({
            success: true,
            apiKey: newRawApiKey,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * DELETE /api/channels/:id
 * Delete a channel and remove session files
 */
router.delete('/:id', async (req, res) => {
    try {
        const channelId = req.params.id;
        const channel = await ChannelService.getChannelById(channelId);
        if (!channel) {
            res.status(404).json({ success: false, error: 'Channel not found' });
            return;
        }
        const waManager = WhatsAppManager.getInstance();
        await waManager.destroySession(channel.id);
        await ChannelService.deleteChannel(channel.id);
        res.json({
            success: true,
            message: 'Channel deleted successfully',
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
export default router;
