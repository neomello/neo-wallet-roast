# NEO Wallet Roast 💀🔥

Brutal AI roasts for your on-chain crypto activity. Designed for Farcaster & Telegram Mini-apps.

## the vision
Crypto is a PvP game. Most are losing. NEO Wallet Roast uses **Claude 3.5 Sonnet** to analyze your wallet data (Etherscan + Moralis) and delivers a high-fidelity, sarcastic, and brutally honest teardown of your "investment" strategy.

## key features
- **Claude API Integration**: Intelligent, context-aware roasts based on your actual holdings.
- **Viral Mechanics**: Built-in sharing for Twitter and Farcaster.
- **High Fidelity UI**: Fire/Dark theme with custom animations and glassmorphism.
- **Multi-platform**: Ready to be deployed as a Farcaster Frame or Telegram Mini App.

## stack
- **Framework**: Next.js 15 (App Router)
- **AI**: Anthropic Claude 3.5 Sonnet
- **Web3**: Viem + Farcaster Mini-app SDK
- **Styling**: Tailwind CSS + Framer Motion
- **Data**: Etherscan / Moralis APIs

## getting started

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your keys:
   - `ANTHROPIC_API_KEY`: Get from console.anthropic.com
   - `ETHERSCAN_API_KEY`: Get from etherscan.io
   - `MORALIS_API_KEY`: Get from moralis.io

3. **Run Dev**:
   ```bash
   npm run dev
   ```

## farcaster integration
This project is built to work seamlessly with the Farcaster Mini-app SDK. It detects the Farcaster context and adapts the UI for the best experience within Warpcast.
