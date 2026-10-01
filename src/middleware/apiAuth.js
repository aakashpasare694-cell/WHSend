import { ApiKeyService } from '../services/apiKeyService.js';
import { ChannelService } from '../services/channelService.js';
export async function apiAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Invalid API key',
        });
        return;
    }
    const rawKey = authHeader.split(' ')[1].trim();
    if (!rawKey) {
        res.status(401).json({
            success: false,
            error: 'Invalid API key',
        });
        return;
    }
    const hash = ApiKeyService.hashApiKey(rawKey);
    const channel = await ChannelService.getChannelByApiKeyHash(hash);
    if (!channel) {
        res.status(401).json({
            success: false,
            error: 'Invalid API key',
        });
        return;
    }
    req.channel = channel;
    next();
}
