import { prisma } from '../database/prisma.js';
import { ApiKeyService } from './apiKeyService.js';
import crypto from 'crypto';

export class ChannelService {
  /**
   * Creates a new Channel with a unique channel_id (ch_...) and API key.
   */
  static async createChannel(name: string) {
    const channelId = `ch_${crypto.randomBytes(4).toString('hex')}`;
    const { rawKey, hash } = ApiKeyService.generateApiKey();

    const channel = await prisma.channel.create({
      data: {
        id: channelId,
        name,
        apiKeyHash: hash,
        status: 'NOT_CONNECTED',
      },
    });

    return {
      channel,
      rawApiKey: rawKey,
    };
  }

  /**
   * Retrieves all channels sorted by creation date.
   */
  static async getAllChannels() {
    return prisma.channel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  /**
   * Retrieves a single channel by ID.
   */
  static async getChannelById(id: string) {
    return prisma.channel.findUnique({
      where: { id },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  /**
   * Finds a channel by comparing SHA-256 hash of raw API key.
   */
  static async getChannelByApiKeyHash(hash: string) {
    return prisma.channel.findFirst({
      where: { apiKeyHash: hash },
    });
  }

  /**
   * Updates channel connection status and optional phone number.
   */
  static async updateChannelStatus(id: string, status: string, whatsappNumber?: string | null) {
    return prisma.channel.update({
      where: { id },
      data: {
        status,
        ...(whatsappNumber !== undefined ? { whatsappNumber } : {}),
      },
    });
  }

  /**
   * Regenerates API key for a channel. Returns new raw API key.
   */
  static async regenerateApiKey(id: string): Promise<string> {
    const { rawKey, hash } = ApiKeyService.generateApiKey();
    await prisma.channel.update({
      where: { id },
      data: { apiKeyHash: hash },
    });
    return rawKey;
  }

  /**
   * Deletes a channel and its message logs.
   */
  static async deleteChannel(id: string) {
    return prisma.channel.delete({
      where: { id },
    });
  }

  /**
   * Logs an outgoing WhatsApp message.
   */
  static async logMessage(
    channelId: string,
    recipient: string,
    content: string,
    status: 'SENT' | 'FAILED',
    whatsappId?: string,
    error?: string
  ) {
    return prisma.message.create({
      data: {
        channelId,
        recipient,
        content,
        status,
        whatsappId,
        error,
      },
    });
  }
}
