    // ======================================
// 🤖 𓉳 𝗠𝗥 𓋹 𝐏𝐫𝐢𝐦𝐞 ᴋʜᴀ𝗹𝗲𝗱𓃵 BOT
// ======================================

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const axios = require("axios");

const PREFIX = ".";
const ownerNumber = "234XXXXXXXXXX"; // CHANGE THIS

const BOT_NAME = "𓉳 𝗠𝗥 𓋹 𝐏𝐫𝐢𝐦𝐞 ᴋʜᴀ𝗹𝗲𝗱𓃵 BOT";

// ======================================
// DATABASE (IN MEMORY)
// ======================================
let db = {
    users: {},
    groups: {}
};

let cooldown = {};

// ======================================
// HELPERS
// ======================================
function getUser(id) {
    if (!db.users[id]) {
        db.users[id] = {
            xp: 0,
            level: 1,
            warns: 0,
            coins: 0
        };
    }
    return db.users[id];
}

function getGroup(id) {
    if (!db.groups[id]) {
        db.groups[id] = {
            antiLink: true,
            antiSpam: true,
            welcome: true,
            ai: false
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

// ======================================
// START BOT
// ======================================
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

    // ======================================
    // MESSAGE HANDLER
    // ======================================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || jid;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        const user = getUser(sender);
        const group = getGroup(jid);

        // ======================================
        // XP SYSTEM
        // ======================================
        if (!text.startsWith(PREFIX)) {
            const leveled = addXP(sender);
            if (leveled) {
                await sock.sendMessage(jid, {
                    text: `🎉 Level Up!\nYou are now Level ${user.level}`
                });
            }
        }

        // ======================================
        // COOLDOWN (ANTI SPAM)
        // ======================================
        const now = Date.now();
        if (cooldown[sender] && now - cooldown[sender] < 2000) return;
        cooldown[sender] = now;

        // ======================================
        // ANTI LINK
        // ======================================
        if (group.antiLink && text.includes("http")) {
            await sock.sendMessage(jid, { delete: msg.key });
            return sock.sendMessage(jid, {
                text: "🚫 Links are not allowed!"
            });
        }

        // ======================================
        // COMMAND SYSTEM
        // ======================================
        if (!text.startsWith(PREFIX)) return;

        const args = text.slice(PREFIX.length).trim().split(" ");
        const cmd = args.shift().toLowerCase();

        const isOwner = sender.includes(ownerNumber);

        // ======================================
        // OWNER COMMANDS
        // ======================================
        if (cmd === "ping") {
            return sock.sendMessage(jid, { text: "🏓 Pong!" });
        }

        if (cmd === "shutdown") {
            if (!isOwner) return;
            await sock.sendMessage(jid, { text: "🛑 Bot shutting down..." });
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
                text: `⚙️ ${key} = ${value}`
            });
        }

        // ======================================
        // PROFILE
        // ======================================
        if (cmd === "profile") {
            return sock.sendMessage(jid, {
                text: `
👤 ${BOT_NAME}

Level: ${user.level}
XP: ${user.xp}
Coins: ${user.coins}
Warnings: ${user.warns}
                `
            });
        }

        // ======================================
        // FUN COMMANDS
        // ======================================
        if (cmd === "dice") {
            return sock.sendMessage(jid, {
                text: `🎲 ${Math.floor(Math.random() * 6) + 1}`
            });
        }

        if (cmd === "joke") {
            return sock.sendMessage(jid, {
                text: "😂 My code works… I just don’t know why!"
            });
        }

        if (cmd === "anime") {
            return sock.sendMessage(jid, {
                text: `🎭 Anime: ${args.join(" ")}`
            });
        }

        // ======================================
        // MEDIA SYSTEM
        // ======================================
        if (cmd === "lyrics") {
            return sock.sendMessage(jid, {
                text: `🎵 Lyrics: ${args.join(" ")}`
            });
        }

        if (cmd === "watermark") {
            return sock.sendMessage(jid, {
                text: `🖼 Watermark: ${args.join(" ")}`
            });
        }

        if (cmd === "sticker") {
            return sock.sendMessage(jid, {
                text: "📌 Sticker engine requires image processing"
            });
        }

        // ======================================
        // AI SYSTEM (HOOK)
        // ======================================
        if (cmd === "ai") {
            const prompt = args.join(" ");

            return sock.sendMessage(jid, {
                text: `🤖 AI RESPONSE:\n${prompt}\n\n(Connect OpenAI API here)`
            });
        }

        // ======================================
        // ECONOMY SYSTEM
        // ======================================
        if (cmd === "balance") {
            return sock.sendMessage(jid, {
                text: `💰 Coins: ${user.coins}`
            });
        }

        if (cmd === "daily") {
            user.coins += 50;
            return sock.sendMessage(jid, {
                text: "🎁 You received 50 coins!"
            });
        }

        // ======================================
        // GROUP COMMANDS
        // ======================================
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
AI Mode: ${group.ai}
                `
            });
        }

        // ======================================
        // MENU
        // ======================================
        if (cmd === "menu") {
            return sock.sendMessage(jid, {
                text: `
🤖 ${BOT_NAME}

🎮 Fun:
.dice .joke .anime

🧠 AI:
.ai

🎵 Media:
.lyrics .watermark .sticker

💰 Economy:
.balance .daily

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

// ======================================
startBot();
