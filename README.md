# WHSend WhatsApp Web Gateway

An internal web application & REST API for session-based WhatsApp messaging powered by Node.js, Express, React, Tailwind CSS, Socket.IO, Prisma (SQLite), and Baileys.

---

## 🌟 Key Features

- **Multi-Channel WhatsApp Session Management**: Create multiple independent WhatsApp Web channels.
- **QR Code Authentication**: Live, auto-refreshing QR code generation streamed via WebSockets/Socket.IO.
- **Persistent Sessions**: Sessions survive server restarts using local encrypted authentication stores (`./whatsapp-sessions/`). No need to re-scan QR codes every time the server restarts.
- **Cryptographic API Keys**: Cryptographically generated API keys (`sk_live_...`) with secure SHA-256 database hashing.
- **REST API Endpoint**: Simple HTTP endpoint `POST /api/v1/messages/send` with Bearer token authentication and rate limiting.
- **Real-Time Dashboard**: Interactive status badges, live toast alerts, credential management, disconnect/delete controls, and an **Interactive API Playground**.

---

## 🛠️ Stack Overview

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons, Socket.IO Client, Vite
- **Backend**: Node.js, Express, TypeScript, Socket.IO, Baileys (`@whiskeysockets/baileys`)
- **Database**: SQLite with Prisma ORM (`dev.db`)
- **Authentication**: Bearer Token API Key authentication (hashed stored in SQLite)

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js v18+ installed on system

### 2. Installation & Setup
```bash
# Clone or navigate to the repository
cd test

# Install all dependencies
npm install

# Push database schema to SQLite (dev.db)
npm run db:push
```

### 3. Run Development Server
```bash
npm run dev
```
This launches:
- **Express Backend & Socket.IO**: `http://localhost:3001`
- **Vite React Frontend**: `http://localhost:3000`

---

## 📲 How to Connect & Send Messages

1. Open `http://localhost:3000` in your web browser.
2. Click **"+ Create Channel"**.
3. Enter a Channel Name (e.g., `My WhatsApp`).
4. Copy the raw **API Key** (`sk_live_...`) shown on screen.
5. On your phone, open WhatsApp → **Settings** (or Menu ⋮) → **Linked Devices** → **Link a Device**.
6. Scan the live QR code displayed on the screen.
7. As soon as you scan, the UI automatically transitions to **"✓ WhatsApp Connected"** showing your connected phone number!

---

## 📡 Sending Messages via REST API

### API Endpoint
`POST http://localhost:3000/api/v1/messages/send`

### Headers
- `Authorization: Bearer YOUR_API_KEY`
- `Content-Type: application/json`

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer sk_live_xxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "919876543210",
    "message": "Hello from my WhatsApp API"
  }'
```

### Response Example (200 OK)
```json
{
  "success": true,
  "message_id": "3EB0481F98A72B",
  "channel_id": "ch_7f82a91c"
}
```

---

## 🔒 Security Best Practices Implemented

- **Raw API keys are displayed ONLY ONCE** upon creation or explicit regeneration.
- Only **SHA-256 hashes** of API keys are stored in the SQLite database (`apiKeyHash`).
- WhatsApp multi-device authentication credentials are saved in `./whatsapp-sessions/` and explicitly ignored in `.gitignore`.
- Express rate limiter applied to `/api/v1/messages/send` (60 requests / min).

---

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma        # SQLite Database Schema (Channel & Message models)
├── src/
│   ├── components/          # React Dashboard UI Components
│   │   ├── Sidebar.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── ChannelsPage.tsx
│   │   ├── CreateChannelModal.tsx
│   │   ├── QRConnectModal.tsx
│   │   ├── ConfirmationModal.tsx
│   │   └── ApiDocsPage.tsx
│   ├── database/
│   │   └── prisma.ts        # Prisma Client Instance
│   ├── middleware/
│   │   └── apiAuth.ts       # Bearer Token API Key Middleware
│   ├── routes/
│   │   ├── channels.ts      # REST API for Channels CRUD
│   │   └── messages.ts      # Send Message REST API Endpoint
│   ├── services/
│   │   ├── apiKeyService.ts # Crypto API Key Generation & SHA-256 Hashing
│   │   ├── channelService.ts# Database Operations
│   │   └── whatsapp.ts      # WhatsApp Baileys Session Manager & Socket.IO
│   ├── App.tsx              # Main React Application & Real-Time Socket.IO
│   ├── main.tsx             # React DOM Mounting
│   ├── index.css            # Tailwind & Custom Styles
│   └── server.ts            # Express & Socket.IO Server Setup
├── whatsapp-sessions/       # Persistent Auth Storage (Git Ignored)
├── .env.example             # Environment Configuration Template
├── .gitignore               # Git Ignore rules
├── package.json             # NPM dependencies & scripts
└── vite.config.ts           # Vite Bundler & API Proxy Settings
```
