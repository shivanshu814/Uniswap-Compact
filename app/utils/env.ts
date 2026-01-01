/**
 * Centralized, type-safe environment variable management.
 * In a production environment, this would use a library like Zod to validate.
 */
export const ENV = {
    RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
    IS_PROD: process.env.NODE_ENV === "production",
    VERSION: "0.1.0-alpha",
};

/**
 * Diagnostic logger that can be toggled or piped to external services.
 */
export const logger = {
    log: (...args: any[]) => !ENV.IS_PROD && console.log("[Compact]", ...args),
    error: (...args: any[]) => console.error("[Compact ERROR]", ...args),
    warn: (...args: any[]) => console.warn("[Compact WARN]", ...args),
};
