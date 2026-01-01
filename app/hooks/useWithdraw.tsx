"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { isAddress, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { THE_COMPACT_ADDRESS, mapContractError } from "../utils";
import { THE_COMPACT_ABI } from "../utils/abi";
import { useLockHistory } from "./useLockHistory";
import { useToast } from "./useToast";

export function useWithdraw() {
    const { address } = useAccount();
    const { showToast, updateToast } = useToast();
    const { addLock } = useLockHistory();
    const queryClient = useQueryClient();
    const [lastToastId, setLastToastId] = useState<number | null>(null);
    const [pendingTx, setPendingTx] = useState<{ lockId: string, amount: string, type: "withdrawal" } | null>(null);

    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isPending) {
            const id = showToast("loading", "Confirm transaction in wallet...");
            setLastToastId(id);
        }
    }, [isPending]);

    useEffect(() => {
        if (isConfirming && hash && lastToastId !== null) {
            updateToast(lastToastId, "loading", "Transaction pending...", hash);
        }
    }, [isConfirming, hash, lastToastId]);

    useEffect(() => {
        if (isSuccess && hash && lastToastId !== null) {
            // Invalidate all related contract reads to refresh UI
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey.some(key =>
                        typeof key === 'object' &&
                        key !== null &&
                        'address' in key &&
                        key.address === THE_COMPACT_ADDRESS
                    )
            });

            if (pendingTx) {
                addLock({
                    id: pendingTx.lockId,
                    txHash: hash,
                    amount: pendingTx.amount,
                    type: "withdrawal"
                });
            }

            updateToast(lastToastId, "success", "Transaction successful!", hash);
            setLastToastId(null);
            setPendingTx(null);
            reset();
        }
    }, [isSuccess, hash, queryClient, pendingTx, addLock, updateToast, lastToastId, reset]);

    useEffect(() => {
        if (error && lastToastId !== null) {
            updateToast(lastToastId, "error", mapContractError(error));
            setLastToastId(null);
            setPendingTx(null);
        }
    }, [error]);

    const enableForcedWithdrawal = useCallback((lockId: string) => {
        if (!lockId) return;
        try {
            writeContract({
                address: THE_COMPACT_ADDRESS as `0x${string}`,
                abi: THE_COMPACT_ABI,
                functionName: "enableForcedWithdrawal",
                args: [BigInt(lockId)],
            });
        } catch (err) {
            showToast("error", mapContractError(err));
        }
    }, [writeContract, showToast]);

    const disableForcedWithdrawal = useCallback((lockId: string) => {
        if (!lockId) return;
        try {
            writeContract({
                address: THE_COMPACT_ADDRESS as `0x${string}`,
                abi: THE_COMPACT_ABI,
                functionName: "disableForcedWithdrawal",
                args: [BigInt(lockId)],
            });
        } catch (err) {
            showToast("error", mapContractError(err));
        }
    }, [writeContract, showToast]);

    const forcedWithdrawal = useCallback((lockId: string, recipient: string, amount: string) => {
        if (!lockId || !amount || !address) return;
        const recipientAddr = recipient && isAddress(recipient) ? recipient : address;

        setPendingTx({ lockId, amount, type: "withdrawal" });

        try {
            writeContract({
                address: THE_COMPACT_ADDRESS as `0x${string}`,
                abi: THE_COMPACT_ABI,
                functionName: "forcedWithdrawal",
                args: [BigInt(lockId), recipientAddr as `0x${string}`, parseEther(amount)],
            });
        } catch (err) {
            setPendingTx(null);
            showToast("error", mapContractError(err));
        }
    }, [address, writeContract, showToast]);

    return {
        enableForcedWithdrawal,
        disableForcedWithdrawal,
        forcedWithdrawal,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}
