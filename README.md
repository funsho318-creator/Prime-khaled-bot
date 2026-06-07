
# 🤖 Prime Khaled WhatsApp Bot – Ultra Pro

A powerful WhatsApp bot built with **Baileys**, featuring AI, games, moderation, leveling, and full automation.

---

# ⚡ FEATURES

## 🧠 AI SYSTEM
- GPT-powered chat (.ai)
- Smart responses
- API integration ready (OpenAI)

## 🛡️ SECURITY SYSTEM
- Anti-link protection
- Anti-spam protection
- Auto moderation system
- Group safety filters

## 👑 ADMIN FEATURES
- Tagall command
- Kick / ban system (extendable)
- Group management tools

## 🎮 GAMES
- 🎲 Dice game (.dice)
- ✂️ Rock Paper Scissors (.rps)
- 🧠 Trivia system (expandable)

## ⭐ LEVEL SYSTEM
- XP per message
- Auto level up
- Rank checker (.rank)

## 👋 GROUP FEATURES
- Welcome messages
- Auto greeting system
- Member tracking

---

# 📁 PROJECT STRUCTURE
services:
  - type: worker
    name: prime-khaled-bot
    runtime: node
    plan: free
    buildCommand: npm install
    startCommand: node index.js
    envVars:
      - key: OPENAI_KEY
        sync: false
      - key: NUMBER
        sync: false
      - key: OWNER
        sync: false
      🤖 Working on Prime Khaled Bot every week.

Recent improvements include AI features, moderation tools, anti-spam protection, leveling systems, and deployment optimization. The goal is to build a fast, reliable, and feature-rich WhatsApp bot for communities and groups. 🚀
# 🛠️ Setup & Installation

## 📋 Prerequisites

Before starting, make sure you have:

- Node.js installed on your device
- Git installed (for cloning the repository)
- A WhatsApp account for pairing

---

## 🚀 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Prime-Khaled-Bot.git
cd Prime-Khaled-Bot
Install Dependencies
Bash
npm install
Start the Bot
Bash
node index.js
📱 Link Your WhatsApp
Open WhatsApp.
Tap Settings.
Select Linked Devices.
Tap Link a Device.
Choose Link with Phone Number.
Enter the pairing code shown in the terminal.
✅ Bot Successfully Connected
Once connected, you'll see:
Plain text
🤖 Prime Khaled Bot Connected Successfully
🚀 System Online
🟢 Ready to Receive Commands
👑 Developer
Prime Khaled
🤖 Bot Name
Prime Khaled Bot
⚡ Version
Ultra Pro Edition
📜 License

This project is licensed under the MIT License.

Copyright © 2026 Prime Khaled
Prime Khaled Bot

Copyright © 2026 Prime Khaled.
All Rights Reserved.

This software is provided for educational, automation, and community management purposes only.

Users are responsible for complying with all applicable laws, regulations, and the Terms of Service of any platform on which this software is used, including WhatsApp.

The developer of Prime Khaled Bot is not responsible for:
- Misuse of the software
- Account bans or restrictions
- Data loss
- Damages resulting from modifications or third-party plugins
- Activities that violate platform policies or local laws

By using this software, you agree that you assume full responsibility for how it is configured and operated.

Prime Khaled Bot, its name, branding, logos, and custom content may not be copied, impersonated, sold, or redistributed as an official version without permission from the owner.

For official releases and updates, use the authorized repository maintained by Prime Khaled.
