# KarmaFi

> **Trade Reddit attention before it goes viral.**

KarmaFi is a BNB Chain native attention market platform where curators launch speculative, tradable attention markets (BEP-20 tokens via bonding curves) around trending Reddit posts.

The product is designed to feel like **Reddit social discovery meets a premium SaaS landing page meets a BNB-native trading terminal**. It operates under strict legal boundaries: markets do not represent copyright, license, endorsement, or ownership of the Reddit posts, but are purely speculative vehicles built on organic public momentum.

---

## Folder Structure

```
├── contracts/               # Solidity smart contracts
│   ├── AttentionToken.sol   # BEP-20 token with mint/burn control
│   ├── BondingCurveMarket.sol# Bonding curve trading engine
│   ├── CreatorClaimVault.sol # Reserved fee store for Reddit creators
│   ├── FeeDistributor.sol   # Protocol fee splitter (curator, creator, treasury)
│   ├── KarmaFiFactory.sol   # Deployer factory & market registry
│   └── MigrationManager.sol # PancakeSwap pool migration interface
├── test/                    # Hardhat contract tests
│   └── KarmaFi.test.js      # Comprehensive contract test suite
├── scripts/                 # Hardhat deployment scripts
│   └── deploy.js            # BNB Smart Chain testnet deploy script
├── prisma/                  # Database management
│   └── schema.prisma        # SQLite & PostgreSQL database schema
├── src/                     # Next.js App Router fullstack code
│   ├── app/                 # UI pages and API route handlers
│   ├── components/          # Shared components (Navbar, Footer)
│   ├── context/             # Wallet sandbox state management
│   └── lib/                 # DB client, Reddit parser & Virality score calculator
├── hardhat.config.js        # Hardhat setup
├── package.json             # App dependencies
└── tsconfig.json            # TS configurations
```

---

## Color Palette

- **Off-white Background**: `#FAFAF7` (warm off-white)
- **Soft Peach**: `#FFE7D6` (vibe details)
- **Orange CTA**: `#FF6B1A` / **Deep Orange**: `#E9500E` (primary buttons)
- **BNB Yellow Accent**: `#F3BA2F` (chain indicator)
- **Charcoal Text**: `#161616` (sleek premium reading)
- **Soft Border**: `#EFE7DF`
- **Success Green**: `#16A34A`
- **Warning Amber**: `#F59E0B`
- **Error Red**: `#DC2626`

---

## Core Smart Contracts

1. **`AttentionToken.sol`**: An OpenZeppelin ERC20 token whose `mint` and `burn` methods are restricted to its associated `BondingCurveMarket`.
2. **`BondingCurveMarket.sol`**: Manages trading on a linear curve ($Price = basePrice + slope \times supply$). Collects a 1% fee on all swaps and sends it to the `FeeDistributor`. Retains BNB balances in reserve to ensure 100% token sell liquidity.
3. **`FeeDistributor.sol`**: Splits fees dynamically according to:
   - **Creator Claim Vault**: 30%
   - **Curator**: 25%
   - **Platform Treasury**: 25%
   - **Liquidity Reserve**: 15%
   - **Safety/Moderation Fund**: 5%
4. **`CreatorClaimVault.sol`**: Accrues creator allocations. Supports OAuth validation payouts.
5. **`KarmaFiFactory.sol`**: Deploys token/curve pairs. Enforces a registry mapped by `sourceHash` to prevent duplicate post launches.

---

## Setup & Running Guide

### 1. Prerequisites
- **Node.js**: v18.x or v20.x
- **npm**: v9.x or v10.x

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Smart Contract Test Suite
Execute the Chai test suite on the in-memory Hardhat Network:
```bash
npx hardhat test
```

### 4. Deploy Contracts to BNB Smart Chain Testnet
Configure your wallet private key in `.env` and run:
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

### 5. Launch the Full-Stack Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## User Interactions in Sandbox Mode

To allow testing the protocol instantly without importing testnet accounts or installing MetaMask, KarmaFi includes a **Sandbox Wallet Simulator**:
1. Clicking **Connect Wallet** allows choosing the **Sandbox Wallet**.
2. This initializes a virtual address with a **10 BNB test balance**.
3. Pasting a Reddit post URL validates the format, generates AI suggestions, and launches a market.
4. Executing Trades on the swap panel simulates the BNB/Token transfers, pushes prices along the mathematical bonding curve, triggers the 1% fee distributor split, and plots candle movements in real-time.
5. Moderators can use the `/admin` route to hide/flag pools or resolve reports.
