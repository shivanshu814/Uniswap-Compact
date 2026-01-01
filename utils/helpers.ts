import { DEFAULT_ALLOCATOR_HEX } from "./constants";

/**
 * Build a lockTag for The Compact contract
 * Format: scope (4 bits) + resetPeriod (4 bits) + allocatorId (88 bits) = 96 bits = 12 bytes
 */
export function buildLockTag(
    scope: number,
    resetPeriod: number,
    allocatorHex: string = DEFAULT_ALLOCATOR_HEX
): `0x${string}` {
    const firstByte = ((scope & 0xf) << 4) | (resetPeriod & 0xf);
    const firstByteHex = firstByte.toString(16).padStart(2, "0");
    const allocHex = allocatorHex.replace(/^0x/, "").padStart(22, "0");
    return `0x${firstByteHex}${allocHex}` as `0x${string}`;
}

/**
 * Format an address for display (0x1234...5678)
 */
export function formatAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format timestamp to locale string
 */
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}
