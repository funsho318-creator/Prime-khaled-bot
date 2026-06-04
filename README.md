````markdown name=README.md url=https://github.com/funsho318-creator/prime-khaled-bot/blob/main/README.md
# Prime Khaled Bot 🤖

A powerful WhatsApp bot built with [Baileys](https://github.com/WhiskeySockets/Baileys) featuring games, tools, entertainment, moderation, and educational content!

## 🚀 Features Overview

### 🎮 Games
- **!guess** - Number guessing game (1-100, 7 attempts)
- **!rps [choice]** - Rock Paper Scissors vs bot
- **!trivia** - Multiple choice trivia questions
- **!flip** - Coin flip (Heads or Tails)
- **!dice [count] [sides]** - Roll dice (e.g., !dice 2 6 = 2d6)

### 🎯 Tools & Utilities
- **!calc [expression]** - Calculator (e.g., !calc 2+2*5)
- **!weather [city]** - Get weather information
- **!timer [time]** - Set timers (e.g., !timer 5m or !timer 30s)
- **!wiki [topic]** - Wikipedia search
- **!lyrics [song]** - Search song lyrics

### 🎪 Entertainment
- **!joke** - Random jokes
- **!quote** - Inspirational quotes
- **!magic** - Magic 8-Ball (yes/no answers)
- **!fact** - Random interesting facts

### 📊 Stats & Leaderboard
- **!stats** - View your personal statistics
- **!leaderboard** - Top 5 players globally

### 🚫 Moderation & Reporting
- **!antisticker on/off** - Block/allow stickers
- **!antibug on/off** - Enable error auto-reporting
- **!reportbug [message]** - Manually report a bug
- **!mybugs** - View your bug reports

### 💬 Chat Responses
Simply chat naturally with the bot:
- `hi`, `hello` - Greetings
- `how are you` - Status check
- `what's your name` - Bot introduction
- `help` - Show all commands
- `thanks`, `thank you` - Acknowledgment
- `bye`, `goodbye` - Farewell

## 📦 Installation

### Prerequisites
- **Node.js** v14 or higher
- **npm** or **yarn**
- A WhatsApp account

### Setup Steps

1. **Clone the repository:**
```bash
git clone https://github.com/funsho318-creator/prime-khaled-bot.git
cd prime-khaled-bot
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the bot:**
```bash
npm start
```

4. **Authenticate:**
   - A QR code will appear in the terminal
   - Scan it with your WhatsApp phone
   - Session will be saved for future runs

## 🎮 How to Use

### Basic Commands

**Start a game:**
```
User: !guess
Bot: 🎮 Welcome to the Guessing Game!...
User: 50
Bot: 📈 Too low! Attempts remaining: 6
```

**Calculator:**
```
User: !calc 15 * 3 + 10
Bot: 🧮 15 * 3 + 10 = 55
```

**Get a fact:**
```
User: !fact
Bot: 📚 Did you know?
     🧠 Honey never spoils! Archaeologists have found 3,000-year-old honey...
```

**Enable anti-sticker mode:**
```
User: !antisticker on
Bot: ✅ Anti-Sticker mode: ON
     🚫 All stickers will be deleted
```

### Scoring System

| Action | Points |
|--------|--------|
| Win guessing game | 50 - (attempts × 5) |
| RPS win | +10 |
| Trivia correct | +25 |
| Trivia wrong | -10 |
| RPS loss | -5 |

## 📁 Project Structure

```
prime-khaled-bot/
├── bot.js                 # Main bot file (all features)
├── responses.json         # Chatbot responses (customizable)
├── stats.json            # User statistics (auto-generated)
├── bugs.json             # Bug reports (auto-generated)
├── menuimages.json       # Menu images (auto-generated)
├── package.json          # Dependencies
├── .gitignore            # Files to ignore
└── README.md             # This file
```

## 📝 Configuration

### Customize Chatbot Responses

Edit `responses.json` to add/modify responses:

```json
{
  "hello": "Hey there! 👋 How can I help you?",
  "custom_message": "Your custom response here!",
  "hi": "Hello! 😊"
}
```

### Add More Facts

Edit `bot.js` and add to the `facts` array:

```javascript
const facts = [
  "🎓 Your new fact here!",
  "📚 Another interesting fact!",
  ...
];
```

## 🔧 Advanced Features

### Anti-Sticker Mode
Automatically deletes all stickers when enabled:
```
!antisticker on  → Stickers deleted
!antisticker off → Stickers allowed
```

### Anti-Bug Mode
Auto-reports errors and tracks crashes:
```
!antibug on      → Errors auto-reported
!antibug off     → Manual reporting only
!reportbug [msg] → Manual bug report
!mybugs          → View your reports
```

### Menu with Custom Image (Future)
```
!setmenuimage [url] → Set custom menu image
!menu               → View menu with image
!clearmenu          → Remove menu image
```

## 🎯 Development

### Running with Auto-Reload
```bash
npm run dev
```

This requires `nodemon` (included in devDependencies).

### File Storage

The bot automatically creates and maintains:
- `session/` - Authentication files (add to .gitignore!)
- `stats.json` - User score tracking
- `bugs.json` - Bug reports
- `responses.json` - Chat responses

### Error Handling

Errors are logged to console. With anti-bug mode enabled, they're also saved to `bugs.json`.

## ⚙️ Available Commands Summary

| Command | Usage | Description |
|---------|-------|-------------|
| !guess | !guess | Start guessing game |
| !rps | !rps rock | Rock Paper Scissors |
| !trivia | !trivia | Trivia question |
| !flip | !flip | Coin flip |
| !dice | !dice 2 6 | Roll 2d6 dice |
| !calc | !calc 2+2 | Calculator |
| !weather | !weather London | Get weather |
| !timer | !timer 5m | Set 5 min timer |
| !wiki | !wiki Python | Wikipedia search |
| !lyrics | !lyrics Shape | Search lyrics |
| !joke | !joke | Random joke |
| !quote | !quote | Random quote |
| !magic | !magic | Magic 8-Ball |
| !fact | !fact | Random fact |
| !stats | !stats | Your statistics |
| !leaderboard | !leaderboard | Top 5 players |
| !antisticker | !antisticker on | Anti-sticker mode |
| !antibug | !antibug on | Anti-bug mode |
| !reportbug | !reportbug lag issue | Report bug |
| !mybugs | !mybugs | View your bugs |
| help | help | Show all commands |

## ⚠️ Important Notes

### Account Safety
- This bot uses WhatsApp Web protocol
- WhatsApp may restrict accounts using unofficial clients
- **Use at your own risk** for testing/personal use only
- Not recommended for business accounts

### Best Practices
1. Use a secondary WhatsApp account for testing
2. Don't spam commands excessively
3. Keep session folder secure (.gitignore is configured)
4. Regularly backup stats.json and bugs.json

## 🐛 Bug Reporting

Found an issue? Report it using:
```
!reportbug [description of the issue]
```

View your reports:
```
!mybugs
```

## 📈 Future Enhancements

Potential features to add:
- Real weather API integration
- Spotify/YouTube lyrics integration
- Database for persistent user data
- Admin commands for owner
- Custom command creation
- Multi-language support
- Group chat management

## 📜 License

MIT License - Feel free to use and modify!

## 👨‍💻 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🤝 Support

Need help? Check:
- Type `help` in chat for command list
- Review this README
- Check `bugs.json` for error logs
- Submit bug reports with `!reportbug`

## 📞 Contact

For issues and questions:
- Open an issue on GitHub
- Submit bug reports via the bot

---

**Made with ❤️ by Prime Khaled Bot**

Happy coding! 🚀
````
