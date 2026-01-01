/**
 * Maps common EVM revert strings and contract errors to user-friendly messages.
 */
export function mapContractError(error: any): string {
    const message = error?.message || error?.toString() || "Unknown error";

    // Common Compact Errors
    if (message.includes("Expired()")) return "The signature has expired.";
    if (message.includes("InvalidSignature()")) return "The provided signature is invalid.";
    if (message.includes("NonceAlreadyUsed()")) return "This transaction nonce has already been used.";
    if (message.includes("InsufficientBalance()")) return "Your balance in the lock is insufficient.";
    if (message.includes("ResetPeriodNotOver()")) return "The reset period has not finished yet.";
    if (message.includes("Unauthorized()")) return "You are not authorized to perform this action.";

    // Generic Web3 Errors
    if (message.includes("user rejected action")) return "Transaction was rejected in your wallet.";
    if (message.includes("insufficient funds for gas")) return "You do not have enough ETH for gas fees.";

    // Fallback to the first line of the error message
    return message.split("\n")[0];
}
