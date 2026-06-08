# KarmaFi

**Trade Reddit attention before it goes viral.** KarmaFi is a BNB Smart Chain–native *attention market* platform: curators launch speculative, tradable BEP-20 tokens — priced by on-chain bonding curves — around trending Reddit posts. Built on **BNB Smart Chain (BSC)** and compatible with other EVM networks.

## Technology Stack

- **Blockchain**: BNB Smart Chain (BEP-20) + EVM-compatible chains
- **Smart Contracts**: Solidity ^0.8.20, OpenZeppelin libraries
- **Frontend**: Next.js 15 (App Router) + React 19 + wagmi + viem + Tailwind CSS
- **Development**: Hardhat, OpenZeppelin Contracts; PostgreSQL (Prisma) indexing layer

## Supported Networks

- **BNB Smart Chain Mainnet** (Chain ID: 56)
- **BNB Smart Chain Testnet** (Chain ID: 97)

## Contract Addresses

Per-market token and bonding-curve contracts are deployed on-demand by the **KarmaFiFactory** when a curator launches a market.

| Network | KarmaFiFactory (Core) | FeeDistributor | CreatorClaimVault |
|---------|------------------------|----------------|-------------------|
| BNB Mainnet | `0xb017eCCD18d374b5ee9461EF22052D298bAf1604` | `0xed8a1eEbC494e187b0Ade9D927724DfD18E52Dd0` | `0xbaB57d8ae5a01dB709c005Fc246082d53849874A` |
| BNB Testnet | `0x8D018F5Ecd8dBb35f963350A86Da0d1EeCAdcAB7` | `0xc73565a7e42d8590a90e377A2233615Db14555Fa` | `0x2A02ad60B749f2979a22Ef992cDd0783866FCF73` |

## Features

- **Launch attention markets from any Reddit post** — curators create a BEP-20 market on-chain via the factory (curator pays gas; no platform custody of launches).
- **Bonding-curve trading** — buy/sell on a deterministic linear price curve, with reserves held in-contract for 100% sell liquidity.
- **Automatic protocol fee split** — a 1% trade fee is routed on-chain: 30% to the Creator Claim Vault, 25% curator, 25% treasury, 15% liquidity reserve, 5% safety/moderation fund.
- **Creator Claim Vault** — original Reddit authors verify account ownership and claim their accrued share of trading fees.
- **Live Reddit data & virality scoring** — markets reflect real post momentum (upvotes, comments) in real time.
- **Gas-efficient, BNB-native design** — optimized contracts with `nonReentrant` trading and owner-controlled moderation (pause/flag).

## Disclaimer

KarmaFi is experimental software. Attention markets are highly speculative and may lose all value. Markets do **not** represent ownership, copyright, endorsement, or affiliation with Reddit or any original poster. Smart contracts may be unaudited — interact at your own risk.
