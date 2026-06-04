const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");

    const sock = makeWASocket({
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    // Simple chatbot responses
    const chatbotResponses = {
        "hello": "Hey there! 👋 How can I help you?",
        "hi": "Hello! 😊",
        "how are you": "I'm doing great, thanks for asking! 💙",
        "what's your name": "I'm a WhatsApp bot! You can call me Bot. 🤖",
        "help": "Available commands:\n- hi/hello: Say hello\n- !dice [count] [sides]: Roll dice\n- !weather [city]: Get weather info\n- !joke: Get a random joke",
        "thanks": "You're welcome! 😄",
        "thank you": "Happy to help! 🙌",
        "bye": "Goodbye! See you soon! 👋",
        "goodbye": "Take care! 👋"
    };

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        const lowerText = text.toLowerCase().trim();

        // Chatbot responses
        if (chatbotResponses[lowerText]) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: chatbotResponses[lowerText]
            });
            return;
        }

        // Dice rolling command
        if (lowerText.startsWith("!dice")) {
            const parts = text.split(" ");
            const diceCount = parseInt(parts[1]) || 1;
            const diceSides = parseInt(parts[2]) || 6;

            // Validate input
            if (diceCount < 1 || diceCount > 100 || diceSides < 2 || diceSides > 1000) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: "Invalid dice parameters! Usage: !dice [count] [sides]\nExample: !dice 2 6 (rolls 2d6)"
                });
                return;
            }

            // Roll the dice
            let total = 0;
            const rolls = [];
            for (let i = 0; i < diceCount; i++) {
                const roll = Math.floor(Math.random() * diceSides) + 1;
                rolls.push(roll);
                total += roll;
            }

            const response = `🎲 Rolling ${diceCount}d${diceSides}\nRolls: ${rolls.join(", ")}\nTotal: ${total}`;
            await sock.sendMessage(msg.key.remoteJid, {
                text: response
            });
            return;
        }

        // Joke command
        if (lowerText === "!joke") {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything!",
                "What do you call a bot that tells jokes? A fun-ction!",
                "Why did the developer go broke? Because they used up all their cache!",
                "How many programmers does it take to change a light bulb? None, that's a hardware problem!"
            ];
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            await sock.sendMessage(msg.key.remoteJid, {
                text: `😂 ${randomJoke}`
            });
            return;
        }

        // Default response for unknown input
        if (lowerText.startsWith("!") || lowerText.length > 3) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "I didn't understand that. Type 'help' for available commands! 🤖"
            });
        }
    });
}

startBot();
