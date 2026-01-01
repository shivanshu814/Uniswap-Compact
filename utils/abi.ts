export const THE_COMPACT_ABI = [
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
] as const;
