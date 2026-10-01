import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle2, Copy, Check, PowerOff, Key, RefreshCw, Smartphone, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  status: string;
  whatsappNumber?: string;
  createdAt: string;
  qr?: string | null;
}

interface QRConnectModalProps {
  isOpen: boolean;
  channel: Channel | null;
  rawApiKey?: string | null;
  onClose: () => void;
  onDisconnect: (channel: Channel) => void;
  onRegenerateKey: (channel: Channel) => void;
  onRefreshQR: (channelId: string) => void;
}

export const QRConnectModal: React.FC<QRConnectModalProps> = ({
  isOpen,
  channel,
  rawApiKey,
  onClose,
  onDisconnect,
  onRegenerateKey,
  onRefreshQR,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (rawApiKey) {
      setShowApiKey(true);
    }
  }, [rawApiKey]);

  if (!isOpen || !channel) return null;

  const handleCopyKey = () => {
    const keyToCopy = rawApiKey || 'sk_live_************************';
    navigator.clipboard.writeText(keyToCopy);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(channel.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const isConnected = channel.status === 'CONNECTED';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {isConnected ? <CheckCircle2 className="w-6 h-6" /> : <QrCode className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isConnected ? 'WhatsApp Connected' : 'Connect WhatsApp'}
              </h3>
              <p className="text-xs text-slate-400">
                Channel: <span className="font-semibold text-slate-200">{channel.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {!isConnected ? (
            /* QR SCAN VIEW */
            <div className="flex flex-col items-center text-center space-y-5">
              {/* QR Code Container */}
              <div className="relative p-4 rounded-2xl bg-white shadow-xl border-4 border-slate-800 group">
                {channel.qr ? (
                  <div className="relative">
                    <img
                      src={channel.qr}
                      alt="WhatsApp Web QR Code"
                      className="w-64 h-64 object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-lg pointer-events-none animate-pulse"></div>
                  </div>
                ) : (
                  <div className="w-64 h-64 flex flex-col items-center justify-center gap-3 text-slate-700 bg-slate-100 rounded-lg">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                    <span className="text-xs font-semibold">Generating QR Code...</span>
                  </div>
                )}
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Status: {channel.status === 'CONNECTING' ? 'Connecting to WhatsApp...' : 'Waiting for scan'}
              </div>

              {/* Step by step instructions */}
              <div className="w-full text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Follow instructions on your phone:
                </p>
                <ol className="text-xs text-slate-400 space-y-1.5 font-medium pl-1">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">1</span>
                    Open <strong>WhatsApp</strong> on your mobile phone
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">2</span>
                    Tap <strong>Menu</strong> (⋮) or <strong>Settings</strong> (⚙️) → <strong>Linked Devices</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">3</span>
                    Tap <strong>Link a Device</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">4</span>
                    Point your camera at this QR code to authenticate
                  </li>
                </ol>
              </div>

              {/* Manual Refresh Button */}
              <button
                onClick={() => onRefreshQR(channel.id)}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate QR Code
              </button>
            </div>
          ) : (
            /* CONNECTED DETAILS VIEW */
            <div className="space-y-5">
              {/* Success Badge Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">✓ WhatsApp Session Connected</h4>
                  <p className="text-xs text-emerald-400/90 mt-0.5">
                    Your session is authenticated and persisted for API operations.
                  </p>
                </div>
              </div>

              {/* Raw Key Warning Notice (If available) */}
              {rawApiKey && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Important:</span> Copy your API key below. For security, raw API keys are only shown once when generated.
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Connected
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Connected Phone</span>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">
                      {channel.whatsappNumber || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Channel ID Copy */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Channel ID</span>
                    <button
                      onClick={handleCopyId}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId ? 'Copied' : 'Copy Channel ID'}
                    </button>
                  </div>
                  <code className="text-xs font-mono text-slate-200 block truncate font-medium">
                    {channel.id}
                  </code>
                </div>

                {/* API Key Copy */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">API Key</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showApiKey ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={handleCopyKey}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey ? 'Copied' : 'Copy API Key'}
                      </button>
                    </div>
                  </div>
                  <code className="text-xs font-mono text-emerald-400 block truncate font-medium bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                    {showApiKey && rawApiKey ? rawApiKey : 'sk_live_********************************'}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => onRegenerateKey(channel)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  Regenerate API Key
                </button>

                <button
                  onClick={() => onDisconnect(channel)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-medium border border-rose-800/40 transition-colors"
                >
                  <PowerOff className="w-3.5 h-3.5" />
                  Disconnect WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
