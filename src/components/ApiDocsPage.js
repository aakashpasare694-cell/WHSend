import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Copy, Check, Terminal, Send, Shield, CheckCircle2, AlertCircle, Play } from 'lucide-react';
export const ApiDocsPage = ({ channels }) => {
    const [copiedCurl, setCopiedCurl] = useState(false);
    const [testApiKey, setTestApiKey] = useState('');
    const [testRecipient, setTestRecipient] = useState('919876543210');
    const [testMessage, setTestMessage] = useState('Hello from WhatsApp Gateway API!');
    const [testLoading, setTestLoading] = useState(false);
    const [testResponse, setTestResponse] = useState(null);
    const curlExample = `curl -X POST http://localhost:3000/api/v1/messages/send \\
  -H "Authorization: Bearer ${testApiKey || 'sk_live_xxxxxxxxxxxxxxxx'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "${testRecipient || '919876543210'}",
    "message": "${testMessage || 'Hello from my API'}"
  }'`;
    const handleCopyCurl = () => {
        navigator.clipboard.writeText(curlExample);
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 2000);
    };
    const handleTestSend = async () => {
        if (!testApiKey.trim()) {
            setTestResponse({ success: false, error: 'Please enter a valid API Key to test sending.' });
            return;
        }
        setTestLoading(true);
        setTestResponse(null);
        try {
            const res = await fetch('/api/v1/messages/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${testApiKey.trim()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: testRecipient.trim(),
                    message: testMessage.trim(),
                }),
            });
            const data = await res.json();
            setTestResponse(data);
        }
        catch (err) {
            setTestResponse({ success: false, error: err.message || 'Failed to execute API request' });
        }
        fiud: {
            setTestLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-8 max-w-5xl mx-auto pb-12", children: [_jsxs("div", { className: "pb-4 border-b border-slate-800", children: [_jsx("h2", { className: "text-2xl font-bold text-white tracking-tight", children: "API Documentation" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Integrate WhatsApp Web message delivery into your backend services using simple REST HTTP calls." })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "px-3 py-1 rounded-lg font-extrabold text-xs bg-emerald-500 text-slate-950 uppercase tracking-wider", children: "POST" }), _jsx("code", { className: "text-sm font-mono text-emerald-400 font-semibold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800", children: "/api/v1/messages/send" })] }), _jsxs("span", { className: "text-xs text-slate-400 flex items-center gap-1.5", children: [_jsx(Shield, { className: "w-3.5 h-3.5 text-emerald-400" }), "Bearer Token Auth Required"] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-1", children: "Send WhatsApp Message" }), _jsx("p", { className: "text-xs text-slate-400 leading-relaxed", children: "Sends an outbound WhatsApp text message using the active WhatsApp Web session associated with the provided API key." })] }), _jsxs("div", { className: "bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2", children: [_jsx("h4", { className: "text-xs font-semibold text-slate-300 uppercase tracking-wider", children: "Authentication Header" }), _jsxs("code", { className: "text-xs font-mono text-slate-300 block", children: ["Authorization: Bearer ", _jsx("span", { className: "text-amber-400", children: "sk_live_xxxxxxxxxxxxxxxx" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2", children: [_jsx(Terminal, { className: "w-4 h-4 text-emerald-400" }), "cURL Request Example"] }), _jsxs("button", { onClick: handleCopyCurl, className: "text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors", children: [copiedCurl ? _jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }), copiedCurl ? 'Copied to Clipboard' : 'Copy cURL'] })] }), _jsx("pre", { className: "bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed", children: curlExample })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("span", { className: "text-xs font-semibold text-emerald-400 flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), "Success Response (200 OK)"] }), _jsx("pre", { className: "bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto", children: `{
  "success": true,
  "message_id": "3EB0481F98A72B",
  "channel_id": "ch_7f82a91c"
}` })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("span", { className: "text-xs font-semibold text-rose-400 flex items-center gap-1.5", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Error Response (400 / 401)"] }), _jsx("pre", { className: "bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto", children: `{
  "success": false,
  "error": "Channel is not connected"
}` })] })] })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20", children: _jsx(Play, { className: "w-5 h-5 fill-current" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Interactive API Playground" }), _jsx("p", { className: "text-xs text-slate-400", children: "Test sending a real message through your connected WhatsApp channel" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5", children: ["API Key (", _jsx("code", { className: "text-amber-400 font-mono", children: "sk_live_..." }), ")"] }), _jsx("input", { type: "text", placeholder: "Paste your channel API key here", value: testApiKey, onChange: (e) => setTestApiKey(e.target.value), className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5", children: "Recipient Phone Number (with Country Code)" }), _jsx("input", { type: "text", placeholder: "e.g. 919876543210", value: testRecipient, onChange: (e) => setTestRecipient(e.target.value), className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5", children: "Message Content" }), _jsx("textarea", { rows: 3, placeholder: "Type your WhatsApp message...", value: testMessage, onChange: (e) => setTestMessage(e.target.value), className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none" })] }), _jsxs("button", { onClick: handleTestSend, disabled: testLoading || !testApiKey || !testRecipient || !testMessage, className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95", children: [_jsx(Send, { className: "w-4 h-4" }), testLoading ? 'Sending Request...' : 'Send Test Message'] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5", children: "Live API Response Output" }), _jsx("pre", { className: "bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 h-56 overflow-y-auto", children: testResponse ? JSON.stringify(testResponse, null, 2) : '// Response will appear here after clicking "Send Test Message"' })] })] })] })] }));
};
