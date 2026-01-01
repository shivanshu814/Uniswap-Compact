"use client";

import { useState } from "react";
import { formatEther, isAddress, parseEther } from "viem";
import {
    useAccount,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import {
    FORCED_WITHDRAWAL_STATUS,
    RESET_PERIODS,
    SCOPES,
    THE_COMPACT_ABI,
    THE_COMPACT_ADDRESS,
} from "../config";

export function WithdrawForm() {
    const { address, isConnected } = useAccount();
    const [lockId, setLockId] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawRecipient, setWithdrawRecipient] = useState("");

    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    // Read lock details
    const { data: lockDetails } = useReadContract({
        address: THE_COMPACT_ADDRESS,
        abi: THE_COMPACT_ABI,
        functionName: "getLockDetails",
        args: lockId ? [BigInt(lockId)] : undefined,
        query: {
            enabled: !!lockId,
        },
    });

    // Read balance
    const { data: balance } = useReadContract({
        address: THE_COMPACT_ADDRESS,
        abi: THE_COMPACT_ABI,
        functionName: "balanceOf",
        args: address && lockId ? [address, BigInt(lockId)] : undefined,
        query: {
            enabled: !!address && !!lockId,
        },
    });

    // Read forced withdrawal status
    const { data: withdrawalStatus } = useReadContract({
        address: THE_COMPACT_ADDRESS,
        abi: THE_COMPACT_ABI,
        functionName: "getForcedWithdrawalStatus",
        args: address && lockId ? [address, BigInt(lockId)] : undefined,
        query: {
            enabled: !!address && !!lockId,
        },
    });

    const handleEnableForcedWithdrawal = () => {
        if (!lockId) return;
        writeContract({
            address: THE_COMPACT_ADDRESS,
            abi: THE_COMPACT_ABI,
            functionName: "enableForcedWithdrawal",
            args: [BigInt(lockId)],
        });
    };

    const handleDisableForcedWithdrawal = () => {
        if (!lockId) return;
        writeContract({
            address: THE_COMPACT_ADDRESS,
            abi: THE_COMPACT_ABI,
            functionName: "disableForcedWithdrawal",
            args: [BigInt(lockId)],
        });
    };

    const handleForcedWithdrawal = () => {
        if (!lockId || !withdrawAmount || !address) return;

        const recipientAddr =
            withdrawRecipient && isAddress(withdrawRecipient)
                ? withdrawRecipient
                : address;

        writeContract({
            address: THE_COMPACT_ADDRESS,
            abi: THE_COMPACT_ABI,
            functionName: "forcedWithdrawal",
            args: [
                BigInt(lockId),
                recipientAddr as `0x${string}`,
                parseEther(withdrawAmount),
            ],
        });
    };

    const status = withdrawalStatus ? Number(withdrawalStatus[0]) : 0;
    const withdrawableAt = withdrawalStatus
        ? Number(withdrawalStatus[1])
        : 0;
    const canWithdraw = status === 2 || (status === 1 && Date.now() / 1000 >= withdrawableAt);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Withdraw Assets</h2>

            {/* Lock ID Input */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                    Resource Lock ID
                </label>
                <input
                    type="text"
                    value={lockId}
                    onChange={(e) => setLockId(e.target.value)}
                    placeholder="Enter lock ID (uint256)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                    The ERC6909 token ID from your deposit transaction
                </p>
            </div>

            {/* Lock Details Display */}
            {lockDetails && lockId && (
                <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">
                        Lock Details
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Token:</span>
                            <span className="font-mono text-xs">
                                {lockDetails[0] === "0x0000000000000000000000000000000000000000"
                                    ? "Native (ETH)"
                                    : `${lockDetails[0].slice(0, 10)}...`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Allocator:</span>
                            <span className="font-mono text-xs">
                                {lockDetails[1].slice(0, 10)}...
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Reset Period:</span>
                            <span>
                                {RESET_PERIODS[lockDetails[2] as keyof typeof RESET_PERIODS]
                                    ?.label || `Unknown (${lockDetails[2]})`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Scope:</span>
                            <span>
                                {SCOPES[lockDetails[3] as keyof typeof SCOPES] ||
                                    `Unknown (${lockDetails[3]})`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Your Balance:</span>
                            <span className="font-semibold text-pink-400">
                                {balance ? formatEther(balance) : "0"} tokens
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdrawal Status */}
            {lockId && withdrawalStatus && (
                <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-300">
                            Forced Withdrawal Status
                        </h3>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${status === 0
                                ? "bg-gray-700 text-gray-300"
                                : status === 1
                                    ? "bg-yellow-900/50 text-yellow-400"
                                    : "bg-green-900/50 text-green-400"
                                }`}
                        >
                            {FORCED_WITHDRAWAL_STATUS[status as keyof typeof FORCED_WITHDRAWAL_STATUS]}
                        </span>
                    </div>
                    {status === 1 && (
                        <p className="text-xs text-gray-400">
                            Withdrawable at:{" "}
                            {new Date(withdrawableAt * 1000).toLocaleString()}
                        </p>
                    )}
                </div>
            )}

            {/* Step 1: Enable Forced Withdrawal */}
            {status === 0 && lockId && (
                <div className="mb-4">
                    <button
                        onClick={handleEnableForcedWithdrawal}
                        disabled={!isConnected || isPending || isConfirming}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
                    >
                        {isPending || isConfirming
                            ? "Processing..."
                            : "Step 1: Enable Forced Withdrawal"}
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        This starts the reset period countdown
                    </p>
                </div>
            )}

            {/* Step 2: Execute Withdrawal */}
            {(status === 1 || status === 2) && lockId && (
                <>
                    {/* Withdraw Amount */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">
                            Withdraw Amount
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                            />
                            {balance && (
                                <button
                                    onClick={() => setWithdrawAmount(formatEther(balance))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 text-sm hover:text-pink-300"
                                >
                                    MAX
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Recipient Address - THE BROWNIE POINTS FEATURE */}
                    <div className="mb-6">
                        <label className="block text-sm text-gray-400 mb-2">
                            Recipient Address
                            <span className="ml-2 text-pink-400">(★ Brownie Points!)</span>
                        </label>
                        <input
                            type="text"
                            value={withdrawRecipient}
                            onChange={(e) => setWithdrawRecipient(e.target.value)}
                            placeholder={address || "Your address or a different address"}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Withdraw to any address - leave empty to withdraw to yourself
                        </p>
                    </div>

                    <button
                        onClick={handleForcedWithdrawal}
                        disabled={
                            !isConnected ||
                            isPending ||
                            isConfirming ||
                            !withdrawAmount ||
                            !canWithdraw
                        }
                        className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-colors"
                    >
                        {!canWithdraw
                            ? "Wait for Reset Period"
                            : isPending || isConfirming
                                ? "Processing..."
                                : "Withdraw to Recipient"}
                    </button>

                    {/* Option to cancel */}
                    <button
                        onClick={handleDisableForcedWithdrawal}
                        disabled={isPending || isConfirming}
                        className="w-full mt-3 bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-400 py-3 rounded-xl font-medium transition-colors"
                    >
                        Cancel Forced Withdrawal
                    </button>
                </>
            )}

            {/* Error/Success Messages */}
            {error && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
                    Error: {error.message.split("\n")[0]}
                </div>
            )}

            {isSuccess && hash && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-xl text-green-400 text-sm">
                    ✓ Transaction successful!
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
