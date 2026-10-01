import React, { useState } from 'react';
import { Copy, Check, Terminal, Send, Shield, CheckCircle2, AlertCircle, Play } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  status: string;
}

interface ApiDocsPageProps {
  channels: Channel[];
}

export const ApiDocsPage: React.FC<ApiDocsPageProps> = ({ channels }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [testApiKey, setTestApiKey] = useState('');
  const [testRecipient, setTestRecipient] = useState('919876543210');
  const [testMessage, setTestMessage] = useState('Hello from WhatsApp Gateway API!');
  const [testLoading, setTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

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
    } catch (err: any) {
      setTestResponse({ success: false, error: err.message || 'Failed to execute API request' });
    } fiud: {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white tracking-tight">API Documentation</h2>
        <p className="text-xs text-slate-400 mt-1">
          Integrate WhatsApp Web message delivery into your backend services using simple REST HTTP calls.
        </p>
      </div>

      {/* Endpoint Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg font-extrabold text-xs bg-emerald-500 text-slate-950 uppercase tracking-wider">
              POST
            </span>
            <code className="text-sm font-mono text-emerald-400 font-semibold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              /api/v1/messages/send
            </code>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Bearer Token Auth Required
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-1">Send WhatsApp Message</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sends an outbound WhatsApp text message using the active WhatsApp Web session associated with the provided API key.
          </p>
        </div>

        {/* Authorization Header Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Authentication Header</h4>
          <code className="text-xs font-mono text-slate-300 block">
            Authorization: Bearer <span className="text-amber-400">sk_live_xxxxxxxxxxxxxxxx</span>
          </code>
        </div>

        {/* cURL Example Code Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              cURL Request Example
            </span>
            <button
              onClick={handleCopyCurl}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCurl ? 'Copied to Clipboard' : 'Copy cURL'}
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {curlExample}
          </pre>
        </div>

        {/* Expected JSON Responses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Success Response (200 OK)
            </span>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
{`{
  "success": true,
  "message_id": "3EB0481F98A72B",
  "channel_id": "ch_7f82a91c"
}`}
            </pre>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Error Response (400 / 401)
            </span>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto">
{`{
  "success": false,
  "error": "Channel is not connected"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Interactive API Tester Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Interactive API Playground</h3>
            <p className="text-xs text-slate-400">Test sending a real message through your connected WhatsApp channel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                API Key (<code className="text-amber-400 font-mono">sk_live_...</code>)
              </label>
              <input
                type="text"
                placeholder="Paste your channel API key here"
                value={testApiKey}
                onChange={(e) => setTestApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Recipient Phone Number (with Country Code)
              </label>
              <input
                type="text"
                placeholder="e.g. 919876543210"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Message Content
              </label>
              <textarea
                rows={3}
                placeholder="Type your WhatsApp message..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleTestSend}
              disabled={testLoading || !testApiKey || !testRecipient || !testMessage}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              {testLoading ? 'Sending Request...' : 'Send Test Message'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Live API Response Output
            </label>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 h-56 overflow-y-auto">
              {testResponse ? JSON.stringify(testResponse, null, 2) : '// Response will appear here after clicking "Send Test Message"'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
