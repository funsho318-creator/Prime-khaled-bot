
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const PREFIX = ".";
const OWNER = "234XXXXXXXXXX";
const BOT = "𓉳 𝗠𝗥 𓋹 V10 GOD SYSTEM";

let logs = [];
let db = { users: {} };

// ================= DASHBOARD =================
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
    res.send(`
    <h1>${BOT}</h1>
    <button onclick="fetch('/cmd/restart')">Restart Bot</button>
    <pre id="log"></pre>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        socket.on("log", d => document.getElementById("log").innerText += d + "\\n");
    </script>
    `);
});

app.get("/cmd/:action", (req, res) => {
    io.emit("panel-command", req.params.action);
    res.send("OK");
});

// ================= BOT =================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const jid = m.key.remoteJid;
        const sender = m.key.participant || jid;

        const text =
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            "";

        logs.push(text);
        io.emit("log", text);

        if (!text.startsWith(PREFIX)) return;

        const [cmd] = text.slice(1).split(" ");

        if (cmd === "ping") {
            return sock.sendMessage(jid, { text: "🏓 Pong V10" });
        }

        if (cmd === "menu") {
            return sock.sendMessage(jid, {
                text: `🤖 ${BOT}\n.ping .menu`
            });
        }

        if (cmd === "stats") {
            return sock.sendMessage(jid, {
                text: `📊 Logs: ${logs.length}`
            });
        }

        if (cmd === "shutdown" && sender.includes(OWNER)) {
            process.exit();
        }
    });

    io.on("connection", (socket) => {
        socket.on("panel-command", (cmd) => {
            if (cmd === "restart") process.exit();
            if (cmd === "logs") socket.emit("log", logs.slice(-10).join("\n"));
        });
    });

    server.listen(PORT, () => {
        console.log("🌐 V10 GOD PANEL RUNNING ON PORT", PORT);
    });
}

startBot();
