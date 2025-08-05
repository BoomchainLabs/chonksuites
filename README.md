# 🧠 ChonkSuites

> Modular Web3 Engagement Suite by **BoomchainLab**  
> Powering the CHONK9K Ecosystem • Multi-chain • Gamified • Tokenized

---

## 🎯 Purpose

ChonkSuites is a composable suite of Web3 infrastructure components designed to gamify user engagement and power tokenized experiences. It integrates smart contracts, decentralized identity, microtask engines, loyalty trackers, and claim automation—all within a secure, scalable system.

---

## 🔍 Features

- 🎮 **Daily Trivia & Tasks** — Win $CHONK9K & $SLERF tokens
- 🧠 **Loyalty Engine** — On-chain & off-chain activity tracker
- 📊 **Leaderboard Dashboard** — Wallet-based user ranking
- 🤖 **Telegram & CLI Agents** — Automate claims & verifications
- 🧩 **Modular Architecture** — API-first, microservice-ready
- 🌐 **Multi-chain Support** — BASE & Solana integrated

---

## 🏗 Structure
chonksuites/
├── chonk-api/        # FastAPI or Flask backend services
├── chonk-ui/         # Next.js + Tailwind frontend
├── bot-server/       # Telegram/Discord automation
├── cli-agent/        # iSH-compatible wallet CLI
├── contracts/        # Solidity + Anchor smart contracts
├── infra/            # CI/CD, Docker, Terraform, GitHub Actions
└── .devcontainer/    # Codespaces & containerized setup


---

## 🚀 Getting Started

```bash
git clone https://github.com/BoomchainLabs/chonksuites.git
cd chonksuites
docker-compose up --build


# Frontend
cd chonk-ui && pnpm install && pnpm dev

# API
cd ../chonk-api && uvicorn main:app --reload



cp .env.example .env
DATABASE_URL=...
TELEGRAM_BOT_TOKEN=...
NEXT_PUBLIC_CHAIN_ID=...
WALLET_PRIVATE_KEY=...


# API
pytest

# Frontend
pnpm test



📍 Token Addresses
	•	$CHONK9K (Solana): DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump


🧭 Roadmap
	•	Trivia MVP & CLI support
	•	Telegram & Wallet auto-claims
	•	NFT-based loyalty badges
	•	DAO-powered voting layer
	•	Multi-chain leaderboard

⸻

👥 Contributors

Crafted with precision by the BoomchainLab team.

📧 Contact: support@boomchainlab.com

⸻

© 2025 BoomchainLab • All Rights Reserved
