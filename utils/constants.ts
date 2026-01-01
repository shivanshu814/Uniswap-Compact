export const THE_COMPACT_ADDRESS = "0x41bbb9ff1b6e63badd72c5bb437cf28f0bdd97b6" as const;
export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
export const DEFAULT_ALLOCATOR_HEX = "abee5dea30ae317772b754";

export const RESET_PERIODS = {
    0: { label: "1 Second", seconds: 1 },
    1: { label: "10 Minutes", seconds: 600 },
    2: { label: "1 Hour", seconds: 3600 },
    3: { label: "1 Day", seconds: 86400 },
    4: { label: "5 Days", seconds: 432000 },
    5: { label: "10 Days", seconds: 864000 },
    6: { label: "30 Days", seconds: 2592000 },
} as const;

export const SCOPES = {
    0: "Multichain",
    1: "Chain-Specific",
} as const;

export const FORCED_WITHDRAWAL_STATUS = {
    0: "Disabled",
    1: "Pending",
    2: "Enabled",
} as const;
