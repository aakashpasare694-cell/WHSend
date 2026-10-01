import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Smartphone, Sparkles, ArrowRight } from 'lucide-react';
export const CreateChannelModal = ({ isOpen, onClose, onSuccess, }) => {
    const [channelName, setChannelName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
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
        }
        catch (err) {
            setError(err.message || 'An error occurred while creating the channel.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-slate-800 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: _jsx(Smartphone, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Create WhatsApp Channel" }), _jsx("p", { className: "text-xs text-slate-400", children: "Set up a new session gateway" })] })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-5", children: [error && (_jsx("div", { className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium", children: error })), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-300", children: ["Channel Name ", _jsx("span", { className: "text-emerald-400", children: "*" })] }), _jsx("input", { type: "text", placeholder: "e.g. My WhatsApp, Customer Support, Sales Alert", value: channelName, onChange: (e) => setChannelName(e.target.value), disabled: loading, className: "w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm", autoFocus: true }), _jsx("p", { className: "text-xs text-slate-500", children: "Pick a recognizable name for internal tracking." })] }), _jsxs("div", { className: "bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-400", children: [_jsxs("div", { className: "font-semibold text-slate-200 flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5 text-emerald-400" }), "What happens next?"] }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-slate-400", children: [_jsxs("li", { children: ["Generates a unique Channel ID (", _jsx("code", { className: "text-slate-300 font-mono", children: "ch_..." }), ")"] }), _jsxs("li", { children: ["Creates a secure API Key (", _jsx("code", { className: "text-slate-300 font-mono", children: "sk_live_..." }), ")"] }), _jsx("li", { children: "Launches WhatsApp Web QR authentication process" })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, disabled: loading, className: "px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: loading || !channelName.trim(), className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-xs shadow-md transition-all active:scale-95", children: loading ? (_jsx(_Fragment, { children: "Creating..." })) : (_jsxs(_Fragment, { children: ["Create & Get QR", _jsx(ArrowRight, { className: "w-4 h-4" })] })) })] })] })] }) }));
};
