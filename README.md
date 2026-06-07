
// ==================================================
// ⚡ ULTRA PRO v8 WHATSAPP BOT
// 𓉳 𝗠𝗥 𓋹 𝐏𝐫𝐢𝐦𝐞 ᴋʜᴀ𝗹𝗲𝗱𓃵 BOT
// ==================================================

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const axios = require("axios");

// ===============================
// CONFIG
// ===============================
const PREFIX = ".";
const ownerNumber = "234XXXXXXXXXX"; // 🔴 CHANGE THIS

const BOT_NAME = "𓉳 𝗠𝗥 𓋹 𝐏𝐫𝐢𝐦𝐞 ᴋʜᴀ𝗹𝗲𝗱𓃵 BOT";

// ===============================
// DATABASE
// ===============================
let db = {
    users: {},
    groups: {}
};

let cooldown = {};

// ===============================
// HELPERS
// ===============================
function getUser(id) {
    if (!db.users[id]) {
        db.users[id] = {
            xp: 0,
            level: 1,
            warns: 0,
            banned: false
        };
    }
    return db.users[id];
}

function getGroup(id) {
    if (!db.groups[id]) {
        db.groups[id] = {
            antiLink: true,
            antiSpam: true,
            welcome: true
        };
    }
    return db.groups[id];
}

function addXP(id) {
    const user = getUser(id);
    user.xp += 5;

    if (user.xp >= user.level * 100) {
        user.level++;
        user.xp = 0;
        return true;
    }
    return false;
}

// ===============================
// START BOT
// ===============================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (u) => {
        const { connection, lastDisconnect } = u;

        if (connection === "open") {
            console.log(`⚡ ${BOT_NAME} ONLINE`);
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) startBot();
        }
    });

    // ===============================
    // MESSAGE HANDLER
    // ===============================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || jid;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        const group = getGroup(jid);
        const user = getUser(sender);

        // ===============================
        // XP SYSTEM
        // ===============================
        if (!text.startsWith(PREFIX)) {
            const leveled = addXP(sender);
            if (leveled) {
                await sock.sendMessage(jid, {
                    text: `🎉 Level Up!\nYou are now Level ${user.level}`
                });
            }
        }

        // ===============================
        // COOLDOWN ANTI-SPAM
        // ===============================
        const now = Date.now();
        if (cooldown[sender] && now - cooldown[sender] < 2000) return;
        cooldown[sender] = now;

        // ===============================
        // ANTI LINK
        // ===============================
        if (group.antiLink && text.includes("http")) {
            await sock.sendMessage(jid, { delete: msg.key });
            return sock.sendMessage(jid, {
                text: "🚫 Links are not allowed here!"
            });
        }

        // ===============================
        // COMMANDS
        // ===============================
        if (!text.startsWith(PREFIX)) return;

        const args = text.slice(PREFIX.length).trim().split(" ");
        const cmd = args.shift().toLowerCase();

        const isOwner = sender.includes(ownerNumber);

        // ===============================
        // OWNER COMMANDS
        // ===============================
        if (cmd === "ping") {
            return sock.sendMessage(jid, { text: "🏓 Pong!" });
        }

        if (cmd === "shutdown") {
            if (!isOwner) return;
            await sock.sendMessage(jid, { text: "🛑 Shutting down..." });
            process.exit();
        }

        if (cmd === "broadcast") {
            if (!isOwner) return;
            return sock.sendMessage(jid, {
                text: `📢 ${args.join(" ")}`
            });
        }

        if (cmd === "set") {
            if (!isOwner) return;
            const key = args[0];
            const value = args[1] === "true";
            group[key] = value;

            return sock.sendMessage(jid, {
                text: `⚙️ ${key} updated to ${value}`
            });
        }

        // ===============================
        // PROFILE
        // ===============================
        if (cmd === "profile") {
            return sock.sendMessage(jid, {
                text: `
👤 ${BOT_NAME}

Level: ${user.level}
XP: ${user.xp}
Warnings: ${user.warns}
                `
            });
        }

        // ===============================
        // FUN
        // ===============================
        if (cmd === "dice") {
            return sock.sendMessage(jid, {
                text: `🎲 ${Math.floor(Math.random() * 6) + 1}`
            });
        }

        if (cmd === "joke") {
            return sock.sendMessage(jid, {
                text: "😂 I tried to catch a bug… but it ran away faster than my code!"
            });
        }

        if (cmd === "anime") {
            return sock.sendMessage(jid, {
                text: `🎭 Anime search: ${args.join(" ")}`
            });
        }

        // ===============================
        // MEDIA
        // ===============================
        if (cmd === "lyrics") {
            return sock.sendMessage(jid, {
                text: `🎵 Lyrics for: ${args.join(" ")}`
            });
        }

        if (cmd === "watermark") {
            return sock.sendMessage(jid, {
                text: `🖼 Watermark: ${args.join(" ")}`
            });
        }

        if (cmd === "sticker") {
            return sock.sendMessage(jid, {
                text: "📌 Sticker feature needs image processing module"
            });
        }

        // ===============================
        // AI (HOOK)
        // ===============================
        if (cmd === "ai") {
            return sock.sendMessage(jid, {
                text: `🤖 AI:\n${args.join(" ")}\n\n(Connect OpenAI API)`
            });
        }

        // ===============================
        // GROUP
        // ===============================
        if (cmd === "tagall") {
            return sock.sendMessage(jid, {
                text: "👥 Tagging all members..."
            });
        }

        if (cmd === "settings") {
            return sock.sendMessage(jid, {
                text: `
⚙️ GROUP SETTINGS

AntiLink: ${group.antiLink}
AntiSpam: ${group.antiSpam}
Welcome: ${group.welcome}
                `
            });
        }

        // ===============================
        // MENU
        // ===============================
        if (cmd === "menu") {
            return sock.sendMessage(jid, {
                text: `
🤖 ${BOT_NAME}

🎮 Fun:
.dice .joke .anime

🎵 Media:
.lyrics .watermark .sticker

🧠 AI:
.ai

👤 Profile:
.profile

👑 Owner:
.ping .broadcast .shutdown .set

⚙️ System:
.settings
                `
            });
        }
    });
}

// ===============================
startBot();
