import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { apiAuthMiddleware } from '../middleware/apiAuth.js';
import { WhatsAppManager } from '../services/whatsapp.js';
const router = Router();
// Basic rate limiting: max 60 messages per minute per IP
const messageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: {
        success: false,
        error: 'Rate limit exceeded. Please wait before sending more messages.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * POST /api/v1/messages/send
 * Authenticated message sending API endpoint
 */
router.post('/send', messageLimiter, apiAuthMiddleware, async (req, res) => {
    try {
        const channel = req.channel;
        if (!channel) {
            res.status(401).json({ success: false, error: 'Invalid API key' });
            return;
        }
        const { to, message } = req.body || {};
        if (!to || typeof to !== 'string' || !to.trim()) {
            res.status(400).json({ success: false, error: 'Invalid recipient' });
            return;
        }
        if (!message || typeof message !== 'string' || !message.trim()) {
            res.status(400).json({ success: false, error: 'Message content is required' });
            return;
        }
        if (message.length > 4096) {
            res.status(400).json({ success: false, error: 'Message content exceeds maximum length of 4096 characters' });
            return;
        }
        const waManager = WhatsAppManager.getInstance();
        // Verify connection status
        if (channel.status !== 'CONNECTED') {
            res.status(400).json({ success: false, error: 'Channel is not connected' });
            return;
        }
        const result = await waManager.sendMessage(channel.id, to.trim(), message.trim());
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error || 'Failed to send message',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message_id: result.message_id,
            channel_id: channel.id,
        });
    }
    catch (err) {
        console.error('[API Messages Send Error]:', err);
        res.status(500).json({
            success: false,
            error: err?.message || 'Internal server error while processing message',
        });
    }
});
export default router;
