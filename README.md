# The Compact - Frontend

A production-grade Next.js 16 application for interacting with Uniswap's **The Compact** protocol on the Sepolia Testnet. This implementation emphasizes architectural resilience, performance optimization, and superior developer experience.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-teal)
![Wagmi](https://img.shields.io/badge/Wagmi-2-orange)

## 🚀 Key Architectural Highlights (PE Edition)

- **🏛️ Decoupled Logic**: Business logic is strictly separated from the UI into specialized custom hooks (`useDeposit`, `useWithdraw`). Components are "thin" and focus only on layout.
- **⚡ Performance First**: Strict usage of `useMemo`, `useCallback`, and `React.memo` to stabilize reference identities. This prevents expensive re-renders across the component tree during real-time interactions.
- **🛡️ Fault Tolerance**:
  - **Global Error Boundary**: Predictable recovery from uncaught crashes.
  - **Human-Readable Error Mapping**: Obscure EVM revert strings are parsed into actionable user instructions.
  - **Hydration Guard**: Elegant handling of SSR/Client mismatches common in Web3.
- **🔌 Infrastructure Layer**: Centralized `ENV` management and a diagnostic logger for multi-environment stability.
- **🔄 State Consistency**: Intelligent query invalidation logic ensures balances and UI states refresh automatically after transactions.

## ✨ Features

- 🔐 **Atomic Deposits** - Support for Native ETH and ERC20 tokens with flexible scopes.
- 💸 **State-Machine Withdrawals** - Guided multi-step forced withdrawal process with visual progress tracking.
- 📜 **Persistent History** - Local storage-backed transaction history with quick-copy utilities.
- 🔔 **Intelligent Feedback** - Real-time multi-stage transaction toasts (Confirming -> Pending -> Success/Error).
- 🎨 **Premium UI Assets** - Glassmorphism, animations, and icons by `lucide-react`.

## 📦 Project Structure

```bash
app/
├── components/
│   ├── ui/                 # Reusable, Atomic UI Components (Memoized)
│   │   ├── Button, Card, Dropdown, FormInput, TransactionProgress
│   ├── DepositForm         # Transaction logic integration
│   ├── WithdrawForm        # State-machine guided UI
│   ├── LockHistory         # Persistent history management
│   └── ErrorBoundary       # High-level resilience layer
├── hooks/                  # Logic-heavy custom hooks
│   ├── useDeposit          # Transaction simulation & workflow
│   ├── useWithdraw         # Multi-step state machine
│   ├── useToast            # Notification bus
│   └── useLockHistory      # Persistence layer
├── utils/                  # Shared infrastructure
│   ├── abi.ts              # Type-safe contract definitions
│   ├── errors.ts           # EVM revert parsing logic
│   ├── env.ts              # Config & Logger
│   └── helpers.ts          # Formatting & Building lock tags
├── config.ts               # Wagmi/Viem infrastructure
├── providers.tsx           # Hydration-guarded initialization
└── types/                  # Centralized TypeScript definitions
```

## 🛠️ Tech Stack

- **Core**: Next.js 16 (App Router), TypeScript 5, Tailwind CSS
- **Web3**: Wagmi 2, Viem, React Query
- **Design**: Lucide Icons, Custom Design System
- **Diagnostics**: Custom Internal Logger

## 📋 Quick Start

```bash
# Clone and install
npm install

# Setup local environment (Example)
# NEXT_PUBLIC_RPC_URL="your-rpc-link"

# Fire it up
npm run dev
```

## 📜 Development Workflows

As part of the Principal Engineer enhancements, we've included agentic workflows for reliability:

- `/build-verify`: Ensures the project maintains a 100% buildable state with zero lint errors.

## 🔗 Contract Information

| Field        | Value                                        |
| ------------ | -------------------------------------------- |
| **Network**  | Sepolia Testnet                              |
| **Contract** | `0x41bbb9ff1b6e63badd72c5bb437cf28f0bdd97b6` |

---

_Built with code quality and scalability as the first-class citizens._
