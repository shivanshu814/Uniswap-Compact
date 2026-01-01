"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { isAddress, parseEther } from "viem";
import { useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
    DEFAULT_ALLOCATOR_HEX,
    THE_COMPACT_ADDRESS,
    buildLockTag,
    copyToClipboard,
    mapContractError
} from "../utils";
import { THE_COMPACT_ABI } from "../utils/abi";
import { useLockHistory } from "./useLockHistory";
import { useToast } from "./useToast";

interface UseDepositProps {
    onSuccess?: (lockId: string) => void;
}

export function useDeposit({ onSuccess }: UseDepositProps = {}) {
    const { address } = useAccount();
    const { showToast, updateToast } = useToast();
    const { addLock } = useLockHistory();
    const queryClient = useQueryClient();
    const [lastToastId, setLastToastId] = useState<number | null>(null);
    const [pendingAmount, setPendingAmount] = useState<string>("0");

    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

    const { data: ethBalance, queryKey: balanceQueryKey } = useBalance({ address });

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
        if (isSuccess && receipt && hash && lastToastId !== null) {
            // Invalidate balance queries to refresh UI
            queryClient.invalidateQueries({ queryKey: balanceQueryKey });

            const transferLog = receipt.logs.find(log =>
                log.topics[0] === "0x1b3d7edb2e9c0b0e7c525b20aaaef0f5940d2ed71663c7d39266ecafac728859"
            );

            const lockId = transferLog?.topics[3] || "";

            addLock({ id: lockId, txHash: hash, amount: pendingAmount, type: "deposit" });
            updateToast(lastToastId, "success", "Deposit successful!", hash);

            if (lockId) {
                copyToClipboard(lockId);
                onSuccess?.(lockId);
            }

            setLastToastId(null);
            reset();
        }
    }, [isSuccess, receipt, hash, queryClient, balanceQueryKey, pendingAmount]);

    useEffect(() => {
        if (error && lastToastId !== null) {
            updateToast(lastToastId, "error", mapContractError(error));
            setLastToastId(null);
        }
    }, [error]);

    const deposit = useCallback(async ({
        type,
        amount,
        tokenAddress,
        resetPeriod,
        scope,
        recipient
    }: {
        type: "native" | "erc20";
        amount: string;
        tokenAddress?: string;
        resetPeriod: number;
        scope: number;
        recipient?: string;
    }) => {
        if (!address || !amount) return;

        const parsedAmount = parseEther(amount);
        if (type === "native" && ethBalance && ethBalance.value < parsedAmount) {
            showToast("error", "Insufficient ETH balance");
            return;
        }

        setPendingAmount(amount);

        const lockTag = buildLockTag(scope, resetPeriod, DEFAULT_ALLOCATOR_HEX);
        const recipientAddr = recipient && isAddress(recipient) ? recipient : address;

        try {
            if (type === "native") {
                writeContract({
                    address: THE_COMPACT_ADDRESS as `0x${string}`,
                    abi: THE_COMPACT_ABI,
                    functionName: "depositNative",
                    args: [lockTag, recipientAddr],
                    value: parsedAmount,
                });
            } else {
                if (!tokenAddress || !isAddress(tokenAddress)) throw new Error("Invalid token address");
                writeContract({
                    address: THE_COMPACT_ADDRESS as `0x${string}`,
                    abi: THE_COMPACT_ABI,
                    functionName: "depositERC20",
                    args: [tokenAddress as `0x${string}`, lockTag, parsedAmount, recipientAddr],
                });
            }
        } catch (err) {
            showToast("error", mapContractError(err));
        }
    }, [address, ethBalance, writeContract, showToast]);

    return {
        deposit,
        isPending: isPending || isConfirming,
        hash,
        ethBalance,
    };
}
