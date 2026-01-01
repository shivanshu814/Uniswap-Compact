"use client";

import { useState } from "react";
import { isAddress, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
    RESET_PERIODS,
    THE_COMPACT_ABI,
    THE_COMPACT_ADDRESS,
} from "../config";

export function DepositForm() {
    const { address, isConnected } = useAccount();
    const [depositType, setDepositType] = useState<"native" | "erc20">("native");
    const [amount, setAmount] = useState("");
    const [tokenAddress, setTokenAddress] = useState("");
    const [allocatorId, setAllocatorId] = useState("1"); // Default allocator ID
    const [resetPeriod, setResetPeriod] = useState<number>(1); // 10 minutes default
    const [scope, setScope] = useState<number>(0); // Multichain default
    const [recipient, setRecipient] = useState("");

    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    // Build lockTag: allocatorId (10 bytes) + resetPeriod (1 byte) + scope (1 byte)
    // Packed as bytes12
    const buildLockTag = (): `0x${string}` => {
        const allocId = BigInt(allocatorId);
        // Pack: scope (4 bits) + resetPeriod (4 bits) in first byte, then allocatorId (88 bits)
        const packed = (BigInt(scope) << 92n) | (BigInt(resetPeriod) << 88n) | allocId;
        // Convert to 12 bytes hex
        const hex = packed.toString(16).padStart(24, "0");
        return `0x${hex}` as `0x${string}`;
    };

    const handleDeposit = async () => {
        if (!address) return;

        const lockTag = buildLockTag();
        const recipientAddr = recipient && isAddress(recipient) ? recipient : address;

        if (depositType === "native") {
            writeContract({
                address: THE_COMPACT_ADDRESS,
                abi: THE_COMPACT_ABI,
                functionName: "depositNative",
                args: [lockTag, recipientAddr],
                value: parseEther(amount),
            });
        } else {
            if (!isAddress(tokenAddress)) {
                alert("Invalid token address");
                return;
            }
            writeContract({
                address: THE_COMPACT_ADDRESS,
                abi: THE_COMPACT_ABI,
                functionName: "depositERC20",
                args: [
                    tokenAddress as `0x${string}`,
                    lockTag,
                    parseEther(amount),
                    recipientAddr,
                ],
            });
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Deposit Assets</h2>

            {/* Deposit Type Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setDepositType("native")}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${depositType === "native"
                            ? "bg-pink-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                >
                    Native (ETH)
                </button>
                <button
                    onClick={() => setDepositType("erc20")}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${depositType === "erc20"
                            ? "bg-pink-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                >
                    ERC20 Token
                </button>
            </div>

            {/* Token Address (for ERC20) */}
            {depositType === "erc20" && (
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                        Token Address
                    </label>
                    <input
                        type="text"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                    />
                </div>
            )}

            {/* Amount */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                />
            </div>

            {/* Allocator ID */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                    Allocator ID
                </label>
                <input
                    type="number"
                    value={allocatorId}
                    onChange={(e) => setAllocatorId(e.target.value)}
                    placeholder="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Must be a registered allocator on The Compact
                </p>
            </div>

            {/* Reset Period */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Reset Period</label>
                <select
                    value={resetPeriod}
                    onChange={(e) => setResetPeriod(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                >
                    {Object.entries(RESET_PERIODS).map(([value, { label }]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Scope */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Scope</label>
                <div className="flex gap-3">
                    <button
                        onClick={() => setScope(0)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-colors ${scope === 0
                                ? "bg-pink-600/20 border-pink-600 text-pink-400 border"
                                : "bg-gray-800 text-gray-400 border border-gray-700"
                            }`}
                    >
                        Multichain
                    </button>
                    <button
                        onClick={() => setScope(1)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-colors ${scope === 1
                                ? "bg-pink-600/20 border-pink-600 text-pink-400 border"
                                : "bg-gray-800 text-gray-400 border border-gray-700"
                            }`}
                    >
                        Chain-Specific
                    </button>
                </div>
            </div>

            {/* Recipient */}
            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                    Recipient (optional)
                </label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder={address || "Your address"}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Leave empty to deposit to your own address
                </p>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleDeposit}
                disabled={!isConnected || isPending || isConfirming || !amount}
                className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-colors"
            >
                {!isConnected
                    ? "Connect Wallet"
                    : isPending
                        ? "Confirming..."
                        : isConfirming
                            ? "Processing..."
                            : "Deposit"}
            </button>

            {/* Status Messages */}
            {error && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
                    Error: {error.message.split("\n")[0]}
                </div>
            )}

            {isSuccess && hash && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-xl text-green-400 text-sm">
                    ✓ Deposit successful!
                    <br />
                    <a
                        href={`https://etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        View transaction
                    </a>
                </div>
            )}
        </div>
    );
}
