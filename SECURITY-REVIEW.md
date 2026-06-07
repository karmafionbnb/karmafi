# KarmaFi — Smart Contract Security Review

> **Important:** This is an **internal security self-assessment** of the KarmaFi contracts, conducted by the development team via manual code review. It is **not** an independent third-party professional audit and should not be represented as one. For a public launch holding meaningful user funds, an audit by an established security firm is strongly recommended.

| | |
|---|---|
| **Project** | KarmaFi — Reddit attention markets on BNB Smart Chain |
| **Review type** | Internal manual review (self-assessment) |
| **Language / Compiler** | Solidity `^0.8.20`, optimizer enabled (200 runs) |
| **Libraries** | OpenZeppelin Contracts (Ownable, ReentrancyGuard, ERC20) |
| **Network** | BNB Smart Chain (Mainnet 56 / Testnet 97) |

## Scope

| Contract | Purpose |
|---|---|
| `AttentionToken.sol` | BEP-20 token; mint/burn restricted to its bonding-curve market |
| `BondingCurveMarket.sol` | Linear bonding-curve trading engine, holds BNB reserve |
| `FeeDistributor.sol` | Splits the 1% trade fee across recipients |
| `CreatorClaimVault.sol` | Accrues + releases creator fee share |
| `KarmaFiFactory.sol` | Deploys token/market pairs, registry |
| `MigrationManager.sol` | (Placeholder) DEX migration interface — *not part of the core deployment* |

## Methodology

Manual line-by-line review covering: access control, reentrancy, arithmetic/overflow, external-call safety, fund solvency, denial-of-service vectors, centralization/trust assumptions, and adherence to checks-effects-interactions (CEI).

## Severity definitions

- **Critical** — direct loss/theft of funds, trivially exploitable.
- **High** — loss of funds under specific conditions, or broken core invariant.
- **Medium** — limited fund risk or denial of service.
- **Low** — minor/edge-case issues, hardening.
- **Informational** — best-practice / design notes.

## Findings summary

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| M-01 | Trading can be bricked by a reverting fee recipient | Medium | Open |
| L-01 | `distributeFees` is permissionless (reward inflation) | Low | Open |
| L-02 | `MigrationManager` traps BNB; placeholder logic | Low | Open (not deployed in core) |
| L-03 | Stray BNB sent directly to `FeeDistributor` is unrecoverable | Low | Open |
| I-01 | Centralized owner privileges | Informational | Acknowledged |
| I-02 | Creator ownership verification is off-chain | Informational | By design |
| I-03 | Compiler/EVM (`PUSH0`) target | Informational | OK on BSC |
| R-01 | `CreatorClaimVault` deposit reverted after a claim | High | **Resolved pre-deploy** |

---

## Detailed findings

### M-01 — Trading can be bricked by a reverting fee recipient (Medium)
`FeeDistributor.distributeFees` forwards each share with `(bool success,) = payable(recipient).call{value}(...); require(success, ...)`. Because the whole call reverts if any recipient rejects BNB, a fee recipient that is a contract reverting on receive will cause **every `buy`/`sell` that triggers a fee distribution to revert**.
- The `curator` recipient is set per-market by the market creator (`createMarket(..., curator)`), so a curator could (accidentally or maliciously) set a reverting contract and make *their* market permanently untradeable.
- `treasury` / `liquidity` / `safety` are owner-configured; a misconfiguration there would brick **all** markets.

**Recommendation:** use a pull-payment pattern (accrue balances, let recipients withdraw), or send without reverting the whole tx (skip a failed transfer and record it), and/or validate that fee recipients are EOAs / known-good addresses.

### L-01 — `distributeFees` is permissionless (Low)
`distributeFees(sourceHash, curator)` is `public payable` with no caller restriction. Anyone can call it with arbitrary `sourceHash`/`curator` and their own BNB. This cannot steal funds (the caller supplies the value), but it can **inflate `pendingRewards[sourceHash]`** in the vault, distorting displayed/claimable creator rewards.
**Recommendation:** restrict callers to registered market contracts (e.g. a factory-maintained allowlist), or accept it as an open "tip" path and ignore for accounting.

### L-02 — `MigrationManager` placeholder traps BNB (Low)
`MigrationManager` is a non-functional placeholder: `isEligibleForMigration` always returns `true`, and `migrateToDex` is `payable` but performs no real DEX integration and has **no withdrawal function** — any BNB sent is permanently locked. It is **not deployed** as part of the core system (the factory/curve do not reference it).
**Recommendation:** do not deploy it in production until real PancakeSwap migration + a fund-recovery path are implemented; or remove from the repo.

### L-03 — Stray BNB to `FeeDistributor` is unrecoverable (Low)
`FeeDistributor` has a `receive()` and forwards funds only inside `distributeFees`. BNB sent directly (not via `distributeFees`) sits with no withdrawal path.
**Recommendation:** add an owner `rescue()` for stray balances, or remove `receive()`.

### I-01 — Centralized owner privileges (Informational)
The `owner` can pause markets, reconfigure all fee recipients, and release creator-vault funds to any recipient/amount it deems verified. A single compromised owner key is a systemic risk.
**Recommendation:** use a multisig (e.g. Gnosis Safe) and/or a timelock for the owner role.

### I-02 — Off-chain creator verification (Informational, by design)
`CreatorClaimVault.claimCreatorRewards` is `onlyOwner`; Reddit account ownership is proven off-chain (the app verifies via the author's public Reddit bio, then an admin releases funds). There is no on-chain proof of Reddit identity — payouts trust the operator's verification.
**Recommendation:** documented as a known trust assumption; consider a dispute window.

### I-03 — Compiler / EVM target (Informational)
Solc `0.8.20` emits the `PUSH0` opcode (Shanghai). BNB Smart Chain supports `PUSH0`, so deployment is fine; noted for any future non-PUSH0 chains.

### R-01 — `CreatorClaimVault` deposit-after-claim revert — **Resolved**
A prior version reverted `depositCreatorRewards` once a `sourceHash` had been claimed, which would have caused all subsequent trades on that market to revert (fee deposit fails → distribution fails → trade fails). **Fixed before deployment:** deposits now always succeed and creators may claim newly-accrued rewards repeatedly.

---

## Positive observations
- `buy`/`sell` are protected with OpenZeppelin `ReentrancyGuard` (`nonReentrant`).
- `CreatorClaimVault.claimCreatorRewards` follows checks-effects-interactions (state zeroed before transfer).
- `AttentionToken` mint/burn is locked to the bonding curve, and the bonding-curve address is set **once** and immutable thereafter — no mint-authority hijack.
- The bonding curve has **no owner withdrawal** of reserve; BNB can only leave via `sell` along the curve (reserve solvency holds: each buy retains its full price-integral, each sell pays out exactly its integral).
- `buy`/`sell` expose `minTokensOut` / `minBNBOut` **slippage** parameters.
- Solidity ≥0.8 built-in overflow/underflow checks; no `delegatecall`, no `tx.origin` auth.
- Duplicate markets prevented via `sourceHash` registry in the factory.

## Conclusion
No **Critical** or **High** severity issues were identified in the current contract set; the one previously-High issue (R-01) was fixed prior to deployment. The most notable open item is **M-01** (DoS via a reverting fee recipient). The system avoids common rug vectors (no admin reserve withdrawal, immutable mint authority, reentrancy guards).

This internal review **does not replace an independent professional audit**, which is recommended before the protocol custodies significant value.
