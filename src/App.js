import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ChannelsPage } from './components/ChannelsPage';
import { ApiDocsPage } from './components/ApiDocsPage';
import { CreateChannelModal } from './components/CreateChannelModal';
import { QRConnectModal } from './components/QRConnectModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [rawApiKey, setRawApiKey] = useState(null);
    // Confirmation modal state
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        confirmVariant: 'warning',
        action: async () => { },
    });
    // Toasts
    const [toasts, setToasts] = useState([]);
    const addToast = (title, message, type = 'info') => {
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
        }
        catch (err) {
            console.error('Failed to fetch channels:', err);
        }
        fontally: {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchChannels();
        // Socket.IO Connection for Real-Time Updates
        const socket = io();
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });
        socket.on('channel:qr', ({ channelId, qr }) => {
            setChannels((prev) => prev.map((c) => c.id === channelId ? { ...c, status: 'WAITING_FOR_QR', qr } : c));
            setSelectedChannel((prev) => prev && prev.id === channelId ? { ...prev, status: 'WAITING_FOR_QR', qr } : prev);
        });
        socket.on('channel:connecting', ({ channelId }) => {
            setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, status: 'CONNECTING' } : c)));
            setSelectedChannel((prev) => prev && prev.id === channelId ? { ...prev, status: 'CONNECTING' } : prev);
        });
        socket.on('channel:connected', ({ channelId, whatsappNumber }) => {
            setChannels((prev) => prev.map((c) => c.id === channelId
                ? { ...c, status: 'CONNECTED', whatsappNumber, qr: null }
                : c));
            setSelectedChannel((prev) => {
                if (prev && prev.id === channelId) {
                    return { ...prev, status: 'CONNECTED', whatsappNumber, qr: null };
                }
                return prev;
            });
            addToast('WhatsApp Session Connected!', `Channel connected to WhatsApp number ${whatsappNumber}`, 'success');
        });
        socket.on('channel:disconnected', ({ channelId }) => {
            setChannels((prev) => prev.map((c) => c.id === channelId
                ? { ...c, status: 'DISCONNECTED', whatsappNumber: undefined, qr: null }
                : c));
            setSelectedChannel((prev) => prev && prev.id === channelId
                ? { ...prev, status: 'DISCONNECTED', whatsappNumber: undefined, qr: null }
                : prev);
            addToast('Session Disconnected', `WhatsApp channel (${channelId}) was disconnected.`, 'warning');
        });
        return () => {
            socket.disconnect();
        };
    }, []);
    const handleChannelCreated = (newChannel, apiKey) => {
        setIsCreateOpen(false);
        setChannels((prev) => [newChannel, ...prev]);
        setRawApiKey(apiKey);
        setSelectedChannel(newChannel);
        setIsConnectModalOpen(true);
        addToast('Channel Created', `Channel "${newChannel.name}" created successfully.`, 'success');
    };
    const handleOpenConnectModal = (channel) => {
        setRawApiKey(null);
        setSelectedChannel(channel);
        setIsConnectModalOpen(true);
        // If channel is not connected and doesn't have QR yet, request QR scan init
        if (channel.status === 'NOT_CONNECTED' || channel.status === 'DISCONNECTED') {
            fetch(`/api/channels/${channel.id}/connect`, { method: 'POST' }).catch((err) => console.error('Failed to trigger connection:', err));
        }
    };
    const handleDisconnectChannel = (channel) => {
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
                }
                catch (err) {
                    console.error('Disconnect failed:', err);
                }
                finally {
                    setConfirmState((prev) => ({ ...prev, isOpen: false }));
                }
            },
        });
    };
    const handleRegenerateKey = (channel) => {
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
                }
                catch (err) {
                    console.error('Regenerate key failed:', err);
                }
                finally {
                    setConfirmState((prev) => ({ ...prev, isOpen: false }));
                }
            },
        });
    };
    const handleDeleteChannel = (channel) => {
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
                }
                catch (err) {
                    console.error('Delete channel failed:', err);
                }
                finally {
                    setConfirmState((prev) => ({ ...prev, isOpen: false }));
                }
            },
        });
    };
    const handleRefreshQR = (channelId) => {
        fetch(`/api/channels/${channelId}/connect`, { method: 'POST' }).catch((err) => console.error('Refresh QR failed:', err));
    };
    const connectedCount = channels.filter((c) => c.status === 'CONNECTED').length;
    return (_jsxs("div", { className: "flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans", children: [_jsx(Sidebar, { activeTab: activeTab, setActiveTab: setActiveTab, connectedCount: connectedCount, totalCount: channels.length }), _jsx("main", { className: "flex-1 overflow-y-auto p-8", children: loading ? (_jsxs("div", { className: "h-full flex flex-col items-center justify-center gap-3 text-slate-400", children: [_jsx("div", { className: "w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" }), _jsx("span", { className: "text-xs font-semibold", children: "Loading WhatsApp Gateway..." })] })) : (_jsxs(_Fragment, { children: [activeTab === 'dashboard' && (_jsx(DashboardOverview, { channels: channels, onCreateChannel: () => setIsCreateOpen(true), onNavigateToChannels: () => setActiveTab('channels'), onNavigateToDocs: () => setActiveTab('docs'), onOpenConnectModal: handleOpenConnectModal })), activeTab === 'channels' && (_jsx(ChannelsPage, { channels: channels, onCreateChannel: () => setIsCreateOpen(true), onOpenConnectModal: handleOpenConnectModal, onDisconnectChannel: handleDisconnectChannel, onRegenerateKey: handleRegenerateKey, onDeleteChannel: handleDeleteChannel })), activeTab === 'docs' && _jsx(ApiDocsPage, { channels: channels })] })) }), _jsx(CreateChannelModal, { isOpen: isCreateOpen, onClose: () => setIsCreateOpen(false), onSuccess: handleChannelCreated }), _jsx(QRConnectModal, { isOpen: isConnectModalOpen, channel: selectedChannel, rawApiKey: rawApiKey, onClose: () => {
                    setIsConnectModalOpen(false);
                    setRawApiKey(null);
                }, onDisconnect: handleDisconnectChannel, onRegenerateKey: handleRegenerateKey, onRefreshQR: handleRefreshQR }), _jsx(ConfirmationModal, { isOpen: confirmState.isOpen, title: confirmState.title, message: confirmState.message, confirmText: confirmState.confirmText, confirmVariant: confirmState.confirmVariant, onConfirm: confirmState.action, onClose: () => setConfirmState((prev) => ({ ...prev, isOpen: false })) }), _jsx("div", { className: "fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none", children: toasts.map((toast) => (_jsxs("div", { className: "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-xs max-w-sm animate-in slide-in-from-bottom duration-200", children: [toast.type === 'success' && _jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-400 shrink-0 mt-0.5" }), toast.type === 'warning' && _jsx(AlertTriangle, { className: "w-5 h-5 text-amber-400 shrink-0 mt-0.5" }), toast.type === 'info' && _jsx(Info, { className: "w-5 h-5 text-teal-400 shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("h5", { className: "font-bold text-white text-sm", children: toast.title }), _jsx("p", { className: "text-slate-400 mt-0.5", children: toast.message })] }), _jsx("button", { onClick: () => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), className: "text-slate-500 hover:text-white", children: _jsx(X, { className: "w-4 h-4" }) })] }, toast.id))) })] }));
}
