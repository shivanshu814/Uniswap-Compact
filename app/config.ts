import { createConfig, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";

// Unichain definition (not in wagmi defaults)
const unichain = {
    id: 130,
    name: "Unichain",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://mainnet.unichain.org"] },
    },
    blockExplorers: {
        default: { name: "Uniscan", url: "https://uniscan.xyz" },
    },
} as const;

export const config = createConfig({
    chains: [mainnet, base, unichain],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [unichain.id]: http(),
    },
});

// The Compact contract address (same on all chains)
export const THE_COMPACT_ADDRESS =
    "0x00000000000000171ede64904551eeDF3C6C9788" as const;

// Reset period enum values
export const RESET_PERIODS = {
    0: { label: "1 Second", seconds: 1 },
    1: { label: "10 Minutes", seconds: 600 },
    2: { label: "1 Hour", seconds: 3600 },
    3: { label: "1 Day", seconds: 86400 },
    4: { label: "5 Days", seconds: 432000 },
    5: { label: "10 Days", seconds: 864000 },
    6: { label: "30 Days", seconds: 2592000 },
} as const;

// Scope enum values
export const SCOPES = {
    0: "Multichain",
    1: "Chain-Specific",
} as const;

// Forced withdrawal status enum
export const FORCED_WITHDRAWAL_STATUS = {
    0: "Disabled",
    1: "Pending",
    2: "Enabled",
} as const;

// The Compact ABI - minimal subset for deposit/withdrawal
export const THE_COMPACT_ABI = [
    // Deposit functions
    {
        inputs: [
            { name: "lockTag", type: "bytes12" },
            { name: "recipient", type: "address" },
        ],
        name: "depositNative",
        outputs: [{ name: "id", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { name: "token", type: "address" },
            { name: "lockTag", type: "bytes12" },
            { name: "amount", type: "uint256" },
            { name: "recipient", type: "address" },
        ],
        name: "depositERC20",
        outputs: [{ name: "id", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    // Forced withdrawal functions
    {
        inputs: [{ name: "id", type: "uint256" }],
        name: "enableForcedWithdrawal",
        outputs: [{ name: "withdrawableAt", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "id", type: "uint256" }],
        name: "disableForcedWithdrawal",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "id", type: "uint256" },
            { name: "recipient", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "forcedWithdrawal",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    // View functions
    {
        inputs: [{ name: "id", type: "uint256" }],
        name: "getLockDetails",
        outputs: [
            { name: "token", type: "address" },
            { name: "allocator", type: "address" },
            { name: "resetPeriod", type: "uint8" },
            { name: "scope", type: "uint8" },
            { name: "lockTag", type: "bytes12" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "account", type: "address" },
            { name: "id", type: "uint256" },
        ],
        name: "getForcedWithdrawalStatus",
        outputs: [
            { name: "status", type: "uint8" },
            { name: "forcedWithdrawalAvailableAt", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    // ERC6909 balance function
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "id", type: "uint256" },
        ],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

// ERC20 ABI for approvals
export const ERC20_ABI = [
    {
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
] as const;
