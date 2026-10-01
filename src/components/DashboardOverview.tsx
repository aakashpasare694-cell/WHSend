import React from 'react';
import { Smartphone, CheckCircle2, Clock, Send, Plus, BookOpen, ArrowRight, RefreshCw } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  status: string;
  whatsappNumber?: string;
  createdAt: string;
  _count?: { messages: number };
}

interface DashboardOverviewProps {
  channels: Channel[];
  onCreateChannel: () => void;
  onNavigateToChannels: () => void;
  onNavigateToDocs: () => void;
  onOpenConnectModal: (channel: Channel) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  channels,
  onCreateChannel,
  onNavigateToChannels,
  onNavigateToDocs,
  onOpenConnectModal,
}) => {
  const connectedChannels = channels.filter((c) => c.status === 'CONNECTED');
  const waitingChannels = channels.filter((c) => c.status === 'WAITING_FOR_QR' || c.status === 'CONNECTING');
  const totalMessages = channels.reduce((acc, c) => acc + (c._count?.messages || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              WhatsApp Web Session Gateway
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Internal multi-session WhatsApp automation engine. Create channels, scan QR codes using your phone, persist sessions across server restarts, and send REST API messages seamlessly.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCreateChannel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Create Channel
            </button>
            <button
              onClick={onNavigateToDocs}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              API Specs
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Channels</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{channels.length}</span>
            <span className="text-xs text-slate-500 font-medium">registered</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Connected Sessions</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400">{connectedChannels.length}</span>
            <span className="text-xs text-emerald-500/80 font-medium">active & ready</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending QR Scans</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">{waitingChannels.length}</span>
            <span className="text-xs text-amber-500/80 font-medium">awaiting phone scan</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Messages Sent</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-teal-400">{totalMessages}</span>
            <span className="text-xs text-teal-500/80 font-medium">total logged</span>
          </div>
        </div>
      </div>

      {/* Channel Overview Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-lg text-white">Channel Overview</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick access to all configured WhatsApp channels</p>
          </div>
          <button
            onClick={onNavigateToChannels}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            Manage Channels
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <p className="text-slate-300 font-medium text-sm">No WhatsApp channels created yet</p>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              Click the "+ Create Channel" button above to get started with QR code authentication.
            </p>
            <button
              onClick={onCreateChannel}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Create First Channel
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 border-b border-slate-800/80 uppercase tracking-wider">
                  <th className="py-3 px-4">Channel Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Channel ID</th>
                  <th className="py-3 px-4">Connected Phone</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {channels.slice(0, 5).map((channel) => (
                  <tr key={channel.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {channel.name}
                    </td>
                    <td className="py-3.5 px-4">
                      {channel.status === 'CONNECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Connected
                        </span>
                      )}
                      {channel.status === 'WAITING_FOR_QR' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                          Waiting for QR
                        </span>
                      )}
                      {channel.status === 'CONNECTING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Connecting
                        </span>
                      )}
                      {channel.status === 'DISCONNECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Disconnected
                        </span>
                      )}
                      {channel.status === 'NOT_CONNECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          Not Connected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      {channel.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                      {channel.whatsappNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenConnectModal(channel)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                      >
                        {channel.status === 'CONNECTED' ? 'View Credentials' : 'Connect QR'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
