# 🌉 Cross-Chain Lending & Repayment Protocol

A decentralized protocol that enables users to **lend ETH**, **borrow YOK across chains**, **repay loans**, and **redeem collateral**, with liquidation mechanisms powered by real-time **Chainlink Price Feeds** and secure **CCIP cross-chain messaging**.

Built using **Vite + React** (frontend), **Solidity** (smart contracts), and **Remix IDE** for deployment. The app operates across **Ethereum Sepolia** and **Avalanche Fuji Testnets**.

---

## 🚀 Overview

This protocol supports a two-sided ecosystem:

### 🟢 Lenders

- Lend ETH on Sepolia and receive **aTokens** representing their stake.
- aTokens accrue rewards and can be redeemed to reclaim the original ETH and protocol earnings.

### 🟣 Borrowers

- Deposit ETH as collateral on Sepolia.
- Borrow **YOK tokens** minted and sent cross-chain to Avalanche Fuji using **Chainlink CCIP**.
- After using or holding the YOK, users repay it on Avalanche to unlock their ETH collateral on Sepolia.

---

## 🔐 Liquidation System

To maintain protocol solvency and prevent undercollateralized positions:

- **Collateral Health Factor** is calculated using real-time **ETH/USD price feeds**.
- If the borrower's **Health Factor drops below 1.0**, their collateral becomes **eligible for liquidation**.
- **Anyone** (a third-party liquidator) can trigger a liquidation transaction when conditions are met.
- Upon liquidation:
  - The protocol transfers part or all of the borrower's ETH collateral to the liquidator.
  - The borrower’s debt is settled or marked as liquidated.

### ⚠️ Example Scenarios:
| Condition                 | Outcome                            |
| ------------------------- | ---------------------------------- |
| Health Factor > 1.5       | Healthy, no action needed          |
| 1.0 < Health Factor < 1.5 | Warning UI displayed               |
| Health Factor <= 1.0      | Anyone can liquidate your position |

Liquidation encourages proper collateralization and creates economic incentives for external actors to maintain system health.

---

## 📈 Token Flows

### ✅ Lending Flow (Sepolia)
1. User deposits ETH.
2. Receives aToken in wallet.
3. Can redeem aToken anytime for ETH + rewards.

### ✅ Borrow Flow (Sepolia → Avalanche)
1. User deposits ETH as collateral.
2. Contract mints YOK token.
3. YOK token is sent cross-chain to Avalanche Fuji via **CCIP**.

### ✅ Repayment Flow (Avalanche → Sepolia)
1. User approves and deposits YOK into the Avalanche contract.
2. A **CCIP message** is sent to Sepolia.
3. Sepolia contract verifies repayment and releases ETH collateral.

---

## 🧩 Features

| Feature                          | Description                                                             |
| -------------------------------- | ----------------------------------------------------------------------- |
| **Cross-Chain Messaging**        | Powered by **Chainlink CCIP** for secure token & message transfers      |
| **Real-Time Liquidation Checks** | Uses **Chainlink Price Feeds** to calculate ETH value and health factor |
| **Yield via aTokens**            | Lenders get interest-bearing tokens redeemable for ETH                  |
| **Health Monitoring**            | Dynamic health factor UI, warnings, and liquidation protection          |
| **Repayment System**             | Secure YOK repayment to unlock Sepolia ETH collateral                   |

---

## 🛠️ Tech Stack

| Layer               | Stack                                  |
| ------------------- | -------------------------------------- |
| Frontend            | Vite + React + Tailwind CSS            |
| Smart Contracts     | Solidity (deployed via Remix IDE)      |
| Blockchain Networks | Sepolia (ETH) and Avalanche Fuji (YOK) |
| Wallet SDK          | Wagmi + Ethers.js                      |
| Messaging           | Chainlink CCIP                         |
| Oracle              | Chainlink Price Feeds                  |

---

## 🗂️ Project Structure

```
src/
├── components/ # UI components
├── constants/ # ABIs and contract addresses
├── pages/ # Portfolio, Home, etc.
├── utils/ # Utility logic and mock data
└── main.jsx # Vite entry point
```

---

## 📦 Developer Setup

### 1. Clone the Repository

```bash
git clone https://github.com/GillHapp/cross_chain_lending_borrwoing
cd cross_chain_lending_borrwoing

npm install

npm run dev

```

| Contract               | Network        | Responsibility                                                            | Address                                      |
| ---------------------- | -------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| `LendingBorrowing.sol` | Sepolia        | Manages ETH lending, borrowing logic, and issues `aToken` to lenders      | `0x6b3f9B8e960B50492bDC5D545d23456c33bD2421` |
| `aToken`               | Sepolia        | ERC-20 token representing interest-bearing deposits from lenders          | `0xce8C76D90679d5b34DB1e9F50771cB39F79B36FC` |
| `Repayment.sol`        | Avalanche Fuji | Handles repayments and triggers cross-chain messaging via Chainlink CCIP  | `0x4db8Db69Ff99F7742D92340b29bd5B6A8018f35E` |
| `CrossChainToken.sol`  | Both           | Mints and manages `YOK` token, facilitates cross-chain approvals via CCIP |  CCIP cross chain token transfer             |

------------------------

## 🔗 Chainlink Services Used

This project integrates multiple Chainlink services to ensure secure, reliable, and decentralized infrastructure for DeFi operations:

### 1. [Chainlink Data Feeds](https://docs.chain.link/data-feeds)

* **Purpose**: Fetches real-time, tamper-proof price data.
* **Use Case**: Used to securely access the **ETH/USD** price feed, ensuring accurate asset valuation within lending and borrowing protocols.

### 2. [Chainlink CCIP (Cross-Chain Interoperability Protocol)](https://docs.chain.link/ccip)

* **Purpose**: Enables secure cross-chain communication and token transfers.
* **Use Case**: Powers seamless cross-chain lending and borrowing by connecting different blockchain networks in a trust-minimized way.

### 3. [Chainlink Cross-Chain Token Manager](https://test.tokenmanager.chain.link/)

* **Purpose**: Manages cross-chain ERC-20 tokens.
* **Use Case**: Deploys and manages a custom cross-chain token (e.g., YOK) pegged to **1 USD**, ensuring price stability and interoperability across chains — a foundational requirement for scalable cross-chain DeFi.


-----------

### 🌍 User Experience
👤 Lender View
Deposit ETH → receive aTokens.

Track balance and redeem.

No liquidation risk.

👤 Borrower View
Deposit ETH as collateral → receive YOK.

Health factor displayed on UI.

Can repay to get ETH back.

If health factor drops below 1.0, risk of being liquidated by others.


| Network            | Purpose                                 |
| ------------------ | --------------------------------------- |
| **Sepolia**        | ETH lending and collateral locking      |
| **Avalanche Fuji** | YOK minting, repayment, and CCIP bridge |

---------------------------

### ✅ Completed Milestones
 Lending & aToken logic

 ETH to YOK cross-chain minting via CCIP

 Repayment & CCIP reverse messaging

 Collateral liquidation logic with Chainlink price feeds

 Health factor UI alerts

 WalletConnect & Ethers integration

 Network switching prompts

 Approve + Deposit flows with toast feedback

 ---------------------------

### 🔮 Coming Soon
Auto-liquidation bot (cron or Chainlink Keepers)

Dashboard analytics for borrowed/lent volumes

Dynamic interest rates based on utilization

Optimistic UI feedback for transactions

📜 License
MIT © 2025 Your Name or Org

🤝 Contributions Welcome
Feel free to fork, improve, and submit PRs. Ideas for improving user experience, automating liquidation, or optimizing contract gas usage are especially welcome.

-------

### 🧠 Built With

🧪 Solidity

⚛️ React + Vite

⛓ Chainlink CCIP

🧮 Chainlink Price Feeds

🌐 Sepolia & Avalanche Fuji


------------------------------------------------

Let me know if you'd like this delivered as a file or if you want help publishing it to GitHub with badges like CI/CD, Vercel deploy, or contract verification links.
