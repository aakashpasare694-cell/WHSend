import React from 'react';
import { Plus, Smartphone, RefreshCw, QrCode, PowerOff, Key, Trash2, CheckCircle2 } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  status: string;
  whatsappNumber?: string;
  createdAt: string;
  qr?: string | null;
  _count?: { messages: number };
}

interface ChannelsPageProps {
  channels: Channel[];
  onCreateChannel: () => void;
  onOpenConnectModal: (channel: Channel) => void;
  onDisconnectChannel: (channel: Channel) => void;
  onRegenerateKey: (channel: Channel) => void;
  onDeleteChannel: (channel: Channel) => void;
}

export const ChannelsPage: React.FC<ChannelsPageProps> = ({
  channels,
  onCreateChannel,
  onOpenConnectModal,
  onDisconnectChannel,
  onRegenerateKey,
  onDeleteChannel,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">WhatsApp Channels</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your connected WhatsApp Web sessions, view real-time authentication status, and manage API credentials.
          </p>
        </div>
        <button
          onClick={onCreateChannel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create Channel
        </button>
      </div>

      {/* Channels Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {channels.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No channels configured</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              Create your first WhatsApp channel to generate an API key and pair your WhatsApp phone number.
            </p>
            <button
              onClick={onCreateChannel}
              className="mt-5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Create Channel
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-950/60 text-xs font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  <th className="py-4 px-6">Channel Name</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Channel ID</th>
                  <th className="py-4 px-6">Created At</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {channels.map((channel) => {
                  const createdDate = new Date(channel.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={channel.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Phone */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-base">{channel.name}</div>
                        {channel.whatsappNumber ? (
                          <div className="text-xs font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                            <span>{channel.whatsappNumber}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 mt-0.5">No phone linked yet</div>
                        )}
                      </td>

                      {/* Status Badges */}
                      <td className="py-4 px-6">
                        {channel.status === 'CONNECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Connected
                          </span>
                        )}
                        {channel.status === 'WAITING_FOR_QR' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            Waiting for QR
                          </span>
                        )}
                        {channel.status === 'CONNECTING' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                            Connecting
                          </span>
                        )}
                        {channel.status === 'DISCONNECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            Disconnected
                          </span>
                        )}
                        {channel.status === 'NOT_CONNECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                            Not Connected
                          </span>
                        )}
                      </td>

                      {/* Channel ID */}
                      <td className="py-4 px-6">
                        <code className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
                          {channel.id}
                        </code>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {createdDate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenConnectModal(channel)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              channel.status === 'CONNECTED'
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                            }`}
                          >
                            {channel.status === 'CONNECTED' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Credentials
                              </>
                            ) : (
                              <>
                                <QrCode className="w-3.5 h-3.5" />
                                Scan QR
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onRegenerateKey(channel)}
                            title="Regenerate API Key"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                          >
                            <Key className="w-4 h-4 text-amber-400" />
                          </button>

                          {channel.status === 'CONNECTED' && (
                            <button
                              onClick={() => onDisconnectChannel(channel)}
                              title="Disconnect Session"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-800/60 transition-colors"
                            >
                              <PowerOff className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteChannel(channel)}
                            title="Delete Channel"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-800/60 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
