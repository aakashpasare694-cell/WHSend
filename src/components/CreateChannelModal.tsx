import React, { useState } from 'react';
import { X, Smartphone, Sparkles, ArrowRight } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (channel: any, apiKey: string) => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) {
      setError('Please enter a valid channel name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: channelName.trim() }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create channel');
      }

      setChannelName('');
      onSuccess(data.channel, data.apiKey);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the channel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create WhatsApp Channel</h3>
              <p className="text-xs text-slate-400">Set up a new session gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Channel Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. My WhatsApp, Customer Support, Sales Alert"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              autoFocus
            />
            <p className="text-xs text-slate-500">
              Pick a recognizable name for internal tracking.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-400">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              What happens next?
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Generates a unique Channel ID (<code className="text-slate-300 font-mono">ch_...</code>)</li>
              <li>Creates a secure API Key (<code className="text-slate-300 font-mono">sk_live_...</code>)</li>
              <li>Launches WhatsApp Web QR authentication process</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !channelName.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              {loading ? (
                <>Creating...</>
              ) : (
                <>
                  Create & Get QR
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
