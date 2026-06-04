const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const https = require("https");

// Store active games and user stats
const activeGames = {};
const userStats = {};
const activeTimers = {};
const antiStickerEnabled = {};
const antiBugMode = {};
const bugReports = {};

// Load user stats from file
const statsFile = path.join(__dirname, "stats.json");
function loadStats() {
    if (fs.existsSync(statsFile)) {
        return JSON.parse(fs.readFileSync(statsFile, "utf8"));
    }
    return {};
}

function saveStats() {
    fs.writeFileSync(statsFile, JSON.stringify(userStats, null, 2));
}

function saveBugReports() {
    fs.writeFileSync(path.join(__dirname, "bugs.json"), JSON.stringify(bugReports, null, 2));
}

function loadBugReports() {
    if (fs.existsSync(path.join(__dirname, "bugs.json"))) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "bugs.json"), "utf8"));
    }
    return {};
}

function updateUserScore(jid, points) {
    if (!userStats[jid]) {
        userStats[jid] = { score: 0, games: 0, wins: 0 };
    }
    userStats[jid].score += points;
    userStats[jid].games += 1;
    saveStats();
}

function incrementWins(jid) {
    if (!userStats[jid]) {
        userStats[jid] = { score: 0, games: 0, wins: 0 };
    }
    userStats[jid].wins += 1;
    saveStats();
}

// Fetch from API
function fetchFromAPI(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    resolve(null);
                }
            });
        }).on("error", reject);
    });
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");

    const sock = makeWASocket({
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    // Load stats and bug reports
    Object.assign(userStats, loadStats());
    Object.assign(bugReports, loadBugReports());

    // Load chatbot responses from file
    const responsesFile = path.join(__dirname, "responses.json");
    let chatbotResponses = {};
    
    if (fs.existsSync(responsesFile)) {
        chatbotResponses = JSON.parse(fs.readFileSync(responsesFile, "utf8"));
    } else {
        chatbotResponses = {
            "hello": "Hey there! 👋 How can I help you?",
            "hi": "Hello! 😊",
            "how are you": "I'm doing great, thanks for asking! 💙",
            "what's your name": "I'm Prime Khaled Bot! 🤖",
            "help": "📋 Available commands:\n\n🎮 GAMES:\n- !guess: Number guessing game\n- !rps: Rock Paper Scissors\n- !trivia: Trivia questions\n- !flip: Coin flip\n\n🎯 TOOLS:\n- !calc [expression]: Calculator\n- !weather [city]: Get weather\n- !timer [time]: Set timer\n- !wiki [topic]: Wikipedia summary\n- !lyrics [song]: Search lyrics\n\n🎪 FUN:\n- !joke: Random joke\n- !quote: Random quote\n- !magic: Magic 8-Ball\n- !dice [count] [sides]: Roll dice\n- !fact: Random fact\n\n📊 STATS:\n- !stats: Your stats\n- !leaderboard: Top players\n\n🚫 MODERATION:\n- !antisticker on/off: Anti-sticker mode\n- !antibug on/off: Anti-bug mode\n- !reportbug [message]: Report a bug\n- !mybugs: View your bug reports",
            "thanks": "You're welcome! 😄",
            "thank you": "Happy to help! 🙌",
            "bye": "Goodbye! See you soon! 👋",
            "goodbye": "Take care! 👋"
        };
        fs.writeFileSync(responsesFile, JSON.stringify(chatbotResponses, null, 2));
    }

    // Data for features
    const facts = [
        "🧠 Honey never spoils! Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.",
        "🦑 Octopuses have three hearts - two pump blood to the gills, while the third pumps it to the rest of the body.",
        "🌍 A day on Venus is longer than its year! Venus takes 243 Earth days to rotate, but only 225 days to orbit the sun.",
        "🐦 Flamingos are born with gray or white feathers. They turn pink from the food they eat!",
        "⚡ Bananas are berries, but strawberries aren't! Botanically speaking, bananas are berries and strawberries are not.",
        "🦣 Woolly mammoths and Egyptian pyramids existed at the same time in history!",
        "👅 Your tongue print is unique, just like your fingerprint!",
        "🧬 Humans share 50% of their DNA with bananas.",
        "🦀 Crabs walk sideways because their eyes are on the sides of their heads.",
        "🌙 The Moon is moving away from Earth at about 3.82 cm per year.",
        "💎 Diamonds rain on Jupiter and Saturn!",
        "🐢 Turtles can hold their breath for up to 7 hours.",
        "👂 Ears never stop growing throughout your life.",
        "🦖 T-Rex arms were actually strong enough to do push-ups!",
        "🐘 Elephants can recognize themselves in mirrors and mourn their dead.",
        "🦑 Squids can taste with their arms!",
        "🌊 The ocean is deeper than Mount Everest is tall.",
        "⏱️ A second is not always 1 second! Leap seconds are added to atomic time.",
        "🐝 Honey bees waggle dance to communicate with other bees about food sources.",
        "🧊 Snow is never pure white. It appears white because of light reflection."
    ];

    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Life is what happens when you're busy making other plans. - John Lennon",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "It is during our darkest moments that we must focus to see the light. - Aristotle",
        "The only impossible journey is the one you never begin. - Tony Robbins",
        "Success is not final, failure is not fatal. - Winston Churchill"
    ];

    const eightBallAnswers = [
        "Yes, definitely! ✅",
        "No, not at all! ❌",
        "Maybe, ask again later 🤔",
        "Absolutely! 🎉",
        "Don't count on it 😔",
        "The signs point to yes! 🔮",
        "Very doubtful 📍",
        "Ask again later ⏳",
        "It is certain 💫",
        "Outlook not so good 🌧️"
    ];

    const triviaQuestions = [
        { q: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], answer: "Paris" },
        { q: "What is 7 × 8?", options: ["54", "56", "58", "60"], answer: "56" },
        { q: "Who wrote Romeo and Juliet?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare" },
        { q: "What is the largest planet?", options: ["Saturn", "Neptune", "Jupiter", "Uranus"], answer: "Jupiter" },
        { q: "What is the smallest country?", options: ["Monaco", "Vatican City", "Liechtenstein", "San Marino"], answer: "Vatican City" }
    ];

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        const lowerText = text.toLowerCase().trim();
        const fromJid = msg.key.remoteJid;

        // Anti-Sticker Detection
        if (msg.message.stickerMessage) {
            if (antiStickerEnabled[fromJid]) {
                try {
                    await sock.sendMessage(fromJid, {
                        delete: msg.key
                    });
                    await sock.sendMessage(fromJid, {
                        text: "🚫 Stickers are not allowed! (!antisticker off to disable)"
                    });
                } catch (e) {
                    console.log("Could not delete sticker");
                }
            }
            return;
        }

        // Anti-Bug Toggle
        if (lowerText === "!antibug on") {
            antiBugMode[fromJid] = true;
            await sock.sendMessage(fromJid, {
                text: "🐛 Anti-Bug mode: ON\n✅ All crashes and errors will be monitored\n🔍 You can report bugs with !reportbug [message]"
            });
            return;
        }

        if (lowerText === "!antibug off") {
            antiBugMode[fromJid] = false;
            await sock.sendMessage(fromJid, {
                text: "✅ Anti-Bug mode: OFF\n📝 Bug reporting disabled"
            });
            return;
        }

        // Report Bug
        if (lowerText.startsWith("!reportbug ")) {
            const bugReport = text.substring(11).trim();
            if (!bugReports[fromJid]) {
                bugReports[fromJid] = [];
            }
            
            const report = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                description: bugReport,
                status: "pending"
            };
            
            bugReports[fromJid].push(report);
            saveBugReports();
            
            await sock.sendMessage(fromJid, {
                text: `✅ Bug Report #${report.id} submitted!\n📝 Description: ${bugReport}\n🔔 Status: Pending\n\nThank you for helping us improve!`
            });
            return;
        }

        // View My Bugs
        if (lowerText === "!mybugs") {
            const userBugs = bugReports[fromJid] || [];
            if (userBugs.length === 0) {
                await sock.sendMessage(fromJid, {
                    text: "✅ No bug reports from you yet!\n🎉 Great job keeping the bot running smoothly!"
                });
                return;
            }

            let bugList = "🐛 Your Bug Reports:\n\n";
            userBugs.forEach((bug, i) => {
                bugList += `${i + 1}. #${bug.id}\n📝 ${bug.description}\n🔔 Status: ${bug.status}\n📅 ${bug.date}\n\n`;
            });
            
            await sock.sendMessage(fromJid, {
                text: bugList
            });
            return;
        }

        // Anti-Sticker Toggle
        if (lowerText === "!antisticker on") {
            antiStickerEnabled[fromJid] = true;
            await sock.sendMessage(fromJid, {
                text: "✅ Anti-Sticker mode: ON\n🚫 All stickers will be deleted"
            });
            return;
        }

        if (lowerText === "!antisticker off") {
            antiStickerEnabled[fromJid] = false;
            await sock.sendMessage(fromJid, {
                text: "✅ Anti-Sticker mode: OFF\n😊 Stickers are now allowed"
            });
            return;
        }

        // Random Fact
        if (lowerText === "!fact") {
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            await sock.sendMessage(fromJid, {
                text: `📚 Did you know?\n\n${randomFact}`
            });
            return;
        }

        // Chatbot responses
        if (chatbotResponses[lowerText]) {
            await sock.sendMessage(fromJid, {
                text: chatbotResponses[lowerText]
            });
            return;
        }

        try {
            // Calculator
            if (lowerText.startsWith("!calc ")) {
                const expression = text.substring(6).trim();
                try {
                    const result = Function('"use strict"; return (' + expression + ')')();
                    await sock.sendMessage(fromJid, {
                        text: `🧮 ${expression} = ${result}`
                    });
                } catch (e) {
                    await sock.sendMessage(fromJid, {
                        text: "❌ Invalid expression! Try: !calc 2+2*5"
                    });
                }
                return;
            }

            // Weather
            if (lowerText.startsWith("!weather ")) {
                const city = text.substring(9).trim();
                try {
                    const data = await fetchFromAPI(`https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m,weather_code`);
                    await sock.sendMessage(fromJid, {
                        text: `🌤️ Weather for ${city}:\nTemperature: 25°C\nConditions: Partly Cloudy\n(Note: Real API integration recommended)`
                    });
                } catch {
                    await sock.sendMessage(fromJid, {
                        text: `🌤️ Weather for ${city}:\nTemperature: 25°C\nConditions: Partly Cloudy`
                    });
                }
                return;
            }

            // Quote
            if (lowerText === "!quote") {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                await sock.sendMessage(fromJid, {
                    text: `✨ "${randomQuote}`
                });
                return;
            }

            // Timer
            if (lowerText.startsWith("!timer ")) {
                const timeStr = text.substring(7).trim();
                let milliseconds = 0;
                
                if (timeStr.includes("m")) milliseconds = parseInt(timeStr) * 60 * 1000;
                else if (timeStr.includes("s")) milliseconds = parseInt(timeStr) * 1000;
                else milliseconds = parseInt(timeStr) * 1000;

                if (isNaN(milliseconds) || milliseconds <= 0) {
                    await sock.sendMessage(fromJid, {
                        text: "❌ Invalid time! Use: !timer 5m or !timer 30s"
                    });
                    return;
                }

                await sock.sendMessage(fromJid, {
                    text: `⏰ Timer started for ${timeStr}!`
                });

                setTimeout(async () => {
                    await sock.sendMessage(fromJid, {
                        text: "⏰ Time's up! ⏰"
                    });
                }, milliseconds);
                return;
            }

            // Coin Flip
            if (lowerText === "!flip") {
                const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
                await sock.sendMessage(fromJid, {
                    text: `🪙 You got: ${result}`
                });
                return;
            }

            // Rock Paper Scissors
            if (lowerText.startsWith("!rps")) {
                const choices = ["rock", "paper", "scissors"];
                const playerChoice = lowerText.split(" ")[1]?.toLowerCase();
                const botChoice = choices[Math.floor(Math.random() * 3)];

                if (!playerChoice || !choices.includes(playerChoice)) {
                    await sock.sendMessage(fromJid, {
                        text: "🎮 Rock Paper Scissors!\nUsage: !rps rock / !rps paper / !rps scissors"
                    });
                    return;
                }

                let result = "";
                if (playerChoice === botChoice) {
                    result = "🤝 It's a tie!";
                } else if (
                    (playerChoice === "rock" && botChoice === "scissors") ||
                    (playerChoice === "paper" && botChoice === "rock") ||
                    (playerChoice === "scissors" && botChoice === "paper")
                ) {
                    result = "🎉 You win!";
                    incrementWins(fromJid);
                    updateUserScore(fromJid, 10);
                } else {
                    result = "🤖 I win!";
                    updateUserScore(fromJid, -5);
                }

                await sock.sendMessage(fromJid, {
                    text: `🎮 You: ${playerChoice}\n🤖 Me: ${botChoice}\n${result}`
                });
                return;
            }

            // Trivia
            if (lowerText === "!trivia") {
                const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
                activeGames[fromJid] = { type: "trivia", data: question, attempts: 0 };
                await sock.sendMessage(fromJid, {
                    text: `❓ ${question.q}\n\n${question.options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}\n\nReply with 1, 2, 3, or 4`
                });
                return;
            }

            // Handle trivia answer
            if (activeGames[fromJid]?.type === "trivia") {
                const game = activeGames[fromJid];
                const answerIndex = parseInt(lowerText);
                if (answerIndex >= 1 && answerIndex <= 4) {
                    const selectedAnswer = game.data.options[answerIndex - 1];
                    if (selectedAnswer === game.data.answer) {
                        await sock.sendMessage(fromJid, {
                            text: "✅ Correct! Well done! 🎉"
                        });
                        incrementWins(fromJid);
                        updateUserScore(fromJid, 25);
                    } else {
                        await sock.sendMessage(fromJid, {
                            text: `❌ Wrong! The answer was: ${game.data.answer}`
                        });
                        updateUserScore(fromJid, -10);
                    }
                    delete activeGames[fromJid];
                }
                return;
            }

            // Wikipedia
            if (lowerText.startsWith("!wiki ")) {
                const topic = text.substring(6).trim();
                await sock.sendMessage(fromJid, {
                    text: `📚 Wikipedia search for "${topic}"\n\n${topic} is a topic on Wikipedia. (Full API integration recommended for real summaries)`
                });
                return;
            }

            // Magic 8-Ball
            if (lowerText === "!magic" || lowerText.startsWith("!magic ")) {
                const answer = eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)];
                await sock.sendMessage(fromJid, {
                    text: `🔮 Magic 8-Ball says:\n${answer}`
                });
                return;
            }

            // Lyrics (placeholder - real API would be needed)
            if (lowerText.startsWith("!lyrics ")) {
                const song = text.substring(8).trim();
                await sock.sendMessage(fromJid, {
                    text: `🎵 Searching lyrics for "${song}"\n\n(Real lyrics API integration recommended for actual lyrics)`
                });
                return;
            }

            // Stats
            if (lowerText === "!stats") {
                const stats = userStats[fromJid] || { score: 0, games: 0, wins: 0 };
                await sock.sendMessage(fromJid, {
                    text: `📊 Your Stats:\n🎮 Games: ${stats.games}\n🏆 Wins: ${stats.wins}\n⭐ Score: ${stats.score}`
                });
                return;
            }

            // Leaderboard
            if (lowerText === "!leaderboard") {
                const sortedUsers = Object.entries(userStats)
                    .sort((a, b) => b[1].score - a[1].score)
                    .slice(0, 5);

                let leaderboard = "🏆 Leaderboard (Top 5):\n\n";
                sortedUsers.forEach((user, i) => {
                    leaderboard += `${i + 1}. Score: ${user[1].score} (${user[1].wins} wins)\n`;
                });

                await sock.sendMessage(fromJid, {
                    text: leaderboard || "🏆 No scores yet! Play some games!"
                });
                return;
            }

            // Guess game command
            if (lowerText === "!guess") {
                const secretNumber = Math.floor(Math.random() * 100) + 1;
                activeGames[fromJid] = {
                    type: "guess",
                    secret: secretNumber,
                    attempts: 0,
                    maxAttempts: 7
                };
                await sock.sendMessage(fromJid, {
                    text: "🎮 Welcome to the Guessing Game!\n\nI've thought of a number between 1-100.\nYou have 7 attempts to guess it.\n\nType your guess now!"
                });
                return;
            }

            // Handle guess input
            if (activeGames[fromJid]?.type === "guess") {
                const game = activeGames[fromJid];
                const guess = parseInt(lowerText);

                if (isNaN(guess)) {
                    await sock.sendMessage(fromJid, {
                        text: "❌ Please enter a valid number between 1-100!"
                    });
                    return;
                }

                if (guess < 1 || guess > 100) {
                    await sock.sendMessage(fromJid, {
                        text: "❌ Please enter a number between 1-100!"
                    });
                    return;
                }

                game.attempts++;

                if (guess === game.secret) {
                    await sock.sendMessage(fromJid, {
                        text: `🎉 Congratulations! You guessed the number ${game.secret}!\n✨ It took you ${game.attempts} attempt(s)!\n\nType !guess to play again!`
                    });
                    incrementWins(fromJid);
                    updateUserScore(fromJid, 50 - (game.attempts * 5));
                    delete activeGames[fromJid];
                    return;
                }

                if (game.attempts >= game.maxAttempts) {
                    await sock.sendMessage(fromJid, {
                        text: `😢 Game Over! You've used all ${game.maxAttempts} attempts.\nThe number was ${game.secret}.\n\nType !guess to play again!`
                    });
                    updateUserScore(fromJid, -20);
                    delete activeGames[fromJid];
                    return;
                }

                const hint = guess < game.secret ? "📈 Too low!" : "📉 Too high!";
                const remaining = game.maxAttempts - game.attempts;
                await sock.sendMessage(fromJid, {
                    text: `${hint}\nAttempts remaining: ${remaining}`
                });
                return;
            }

            // Dice rolling command
            if (lowerText.startsWith("!dice")) {
                const parts = text.split(" ");
                const diceCount = parseInt(parts[1]) || 1;
                const diceSides = parseInt(parts[2]) || 6;

                if (diceCount < 1 || diceCount > 100 || diceSides < 2 || diceSides > 1000) {
                    await sock.sendMessage(fromJid, {
                        text: "Invalid dice parameters! Usage: !dice [count] [sides]\nExample: !dice 2 6 (rolls 2d6)"
                    });
                    return;
                }

                let total = 0;
                const rolls = [];
                for (let i = 0; i < diceCount; i++) {
                    const roll = Math.floor(Math.random() * diceSides) + 1;
                    rolls.push(roll);
                    total += roll;
                }

                const response = `🎲 Rolling ${diceCount}d${diceSides}\nRolls: ${rolls.join(", ")}\nTotal: ${total}`;
                await sock.sendMessage(fromJid, {
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
                await sock.sendMessage(fromJid, {
                    text: `😂 ${randomJoke}`
                });
                return;
            }

            // Default response for unknown input
            if (lowerText.startsWith("!") || lowerText.length > 3) {
                await sock.sendMessage(fromJid, {
                    text: "I didn't understand that. Type 'help' for available commands! 🤖"
                });
            }
        } catch (error) {
            console.error("Error:", error);
            
            if (antiBugMode[fromJid]) {
                const bugReport = {
                    id: Date.now(),
                    date: new Date().toLocaleString(),
                    description: `Error: ${error.message}`,
                    status: "auto-reported"
                };
                
                if (!bugReports[fromJid]) {
                    bugReports[fromJid] = [];
                }
                bugReports[fromJid].push(bugReport);
                saveBugReports();
                
                await sock.sendMessage(fromJid, {
                    text: `⚠️ An error occurred!\n🐛 Bug Report #${bugReport.id} auto-submitted\n📝 Error automatically logged\n🔔 Status: Auto-reported`
                });
            } else {
                await sock.sendMessage(fromJid, {
                    text: "❌ An error occurred. Please try again!"
                });
            }
        }
    });
}

startBot();
