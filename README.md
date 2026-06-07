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
