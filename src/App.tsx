import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ChannelsPage } from './components/ChannelsPage';
import { ApiDocsPage } from './components/ApiDocsPage';
import { CreateChannelModal } from './components/CreateChannelModal';
import { QRConnectModal } from './components/QRConnectModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  status: string;
  whatsappNumber?: string;
  createdAt: string;
  qr?: string | null;
  _count?: { messages: number };
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'channels' | 'docs'>('dashboard');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [rawApiKey, setRawApiKey] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: 'danger' | 'warning' | 'primary';
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    confirmVariant: 'warning',
    action: async () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/channels');
      const data = await res.json();
      if (data.success) {
        setChannels(data.channels);
      }
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();

    // Socket.IO Connection for Real-Time Updates
    const socket: Socket = io();

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('channel:qr', ({ channelId, qr }: { channelId: string; qr: string }) => {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === channelId ? { ...c, status: 'WAITING_FOR_QR', qr } : c
        )
      );

      setSelectedChannel((prev) =>
        prev && prev.id === channelId ? { ...prev, status: 'WAITING_FOR_QR', qr } : prev
      );
    });

    socket.on('channel:connecting', ({ channelId }: { channelId: string }) => {
      setChannels((prev) =>
        prev.map((c) => (c.id === channelId ? { ...c, status: 'CONNECTING' } : c))
      );
      setSelectedChannel((prev) =>
        prev && prev.id === channelId ? { ...prev, status: 'CONNECTING' } : prev
      );
    });

    socket.on(
      'channel:connected',
      ({ channelId, whatsappNumber }: { channelId: string; whatsappNumber: string }) => {
        setChannels((prev) =>
          prev.map((c) =>
            c.id === channelId
              ? { ...c, status: 'CONNECTED', whatsappNumber, qr: null }
              : c
          )
        );

        setSelectedChannel((prev) => {
          if (prev && prev.id === channelId) {
            return { ...prev, status: 'CONNECTED', whatsappNumber, qr: null };
          }
          return prev;
        });

        addToast(
          'WhatsApp Session Connected!',
          `Channel connected to WhatsApp number ${whatsappNumber}`,
          'success'
        );
      }
    );

    socket.on('channel:disconnected', ({ channelId }: { channelId: string }) => {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === channelId
            ? { ...c, status: 'DISCONNECTED', whatsappNumber: undefined, qr: null }
            : c
        )
      );

      setSelectedChannel((prev) =>
        prev && prev.id === channelId
          ? { ...prev, status: 'DISCONNECTED', whatsappNumber: undefined, qr: null }
          : prev
      );

      addToast('Session Disconnected', `WhatsApp channel (${channelId}) was disconnected.`, 'warning');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChannelCreated = (newChannel: Channel, apiKey: string) => {
    setIsCreateOpen(false);
    setChannels((prev) => [newChannel, ...prev]);
    setRawApiKey(apiKey);
    setSelectedChannel(newChannel);
    setIsConnectModalOpen(true);
    addToast('Channel Created', `Channel "${newChannel.name}" created successfully.`, 'success');
  };

  const handleOpenConnectModal = (channel: Channel) => {
    setRawApiKey(null);
    setSelectedChannel(channel);
    setIsConnectModalOpen(true);

    // If channel is not connected and doesn't have QR yet, request QR scan init
    if (channel.status === 'NOT_CONNECTED' || channel.status === 'DISCONNECTED') {
      fetch(`/api/channels/${channel.id}/connect`, { method: 'POST' }).catch((err) =>
        console.error('Failed to trigger connection:', err)
      );
    }
  };

  const handleDisconnectChannel = (channel: Channel) => {
    setConfirmState({
      isOpen: true,
      title: `Disconnect ${channel.name}?`,
      message: 'This will end the active WhatsApp Web session. You will need to scan a new QR code to reconnect.',
      confirmText: 'Disconnect',
      confirmVariant: 'danger',
      action: async () => {
        try {
          await fetch(`/api/channels/${channel.id}/disconnect`, { method: 'POST' });
          addToast('Disconnecting', `Disconnect request sent for ${channel.name}`, 'info');
        } catch (err) {
          console.error('Disconnect failed:', err);
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleRegenerateKey = (channel: Channel) => {
    setConfirmState({
      isOpen: true,
      title: `Regenerate API Key for ${channel.name}?`,
      message: 'The current API key will be immediately invalidated. Any applications using the old key will lose access.',
      confirmText: 'Regenerate API Key',
      confirmVariant: 'warning',
      action: async () => {
        try {
          const res = await fetch(`/api/channels/${channel.id}/regenerate-key`, { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            setRawApiKey(data.apiKey);
            setSelectedChannel(channel);
            setIsConnectModalOpen(true);
            addToast('API Key Regenerated', 'Copy your new API key now.', 'success');
          }
        } catch (err) {
          console.error('Regenerate key failed:', err);
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleDeleteChannel = (channel: Channel) => {
    setConfirmState({
      isOpen: true,
      title: `Delete Channel ${channel.name}?`,
      message: 'This action is permanent. All session data, API credentials, and message history will be deleted.',
      confirmText: 'Delete Channel',
      confirmVariant: 'danger',
      action: async () => {
        try {
          await fetch(`/api/channels/${channel.id}`, { method: 'DELETE' });
          setChannels((prev) => prev.filter((c) => c.id !== channel.id));
          if (selectedChannel?.id === channel.id) {
            setIsConnectModalOpen(false);
            setSelectedChannel(null);
          }
          addToast('Channel Deleted', `Channel "${channel.name}" has been deleted.`, 'info');
        } catch (err) {
          console.error('Delete channel failed:', err);
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleRefreshQR = (channelId: string) => {
    fetch(`/api/channels/${channelId}/connect`, { method: 'POST' }).catch((err) =>
      console.error('Refresh QR failed:', err)
    );
  };

  const connectedCount = channels.filter((c) => c.status === 'CONNECTED').length;

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectedCount={connectedCount}
        totalCount={channels.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
            <span className="text-xs font-semibold">Loading WhatsApp Gateway...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardOverview
                channels={channels}
                onCreateChannel={() => setIsCreateOpen(true)}
                onNavigateToChannels={() => setActiveTab('channels')}
                onNavigateToDocs={() => setActiveTab('docs')}
                onOpenConnectModal={handleOpenConnectModal}
              />
            )}

            {activeTab === 'channels' && (
              <ChannelsPage
                channels={channels}
                onCreateChannel={() => setIsCreateOpen(true)}
                onOpenConnectModal={handleOpenConnectModal}
                onDisconnectChannel={handleDisconnectChannel}
                onRegenerateKey={handleRegenerateKey}
                onDeleteChannel={handleDeleteChannel}
              />
            )}

            {activeTab === 'docs' && <ApiDocsPage channels={channels} />}
          </>
        )}
      </main>

      {/* Modals */}
      <CreateChannelModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleChannelCreated}
      />

      <QRConnectModal
        isOpen={isConnectModalOpen}
        channel={selectedChannel}
        rawApiKey={rawApiKey}
        onClose={() => {
          setIsConnectModalOpen(false);
          setRawApiKey(null);
        }}
        onDisconnect={handleDisconnectChannel}
        onRegenerateKey={handleRegenerateKey}
        onRefreshQR={handleRefreshQR}
      />

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        confirmVariant={confirmState.confirmVariant}
        onConfirm={confirmState.action}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notifications Overlay */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-xs max-w-sm animate-in slide-in-from-bottom duration-200"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <h5 className="font-bold text-white text-sm">{toast.title}</h5>
              <p className="text-slate-400 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
