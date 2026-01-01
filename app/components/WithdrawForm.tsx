"use client";

import { ArrowUpFromLine, Clock, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useWithdraw } from "../hooks";
import {
    FORCED_WITHDRAWAL_STATUS,
    RESET_PERIODS,
    SCOPES,
    THE_COMPACT_ADDRESS,
    formatAddress
} from "../utils";
import { THE_COMPACT_ABI } from "../utils/abi";
import { Button, Card, FormInput, TransactionProgress } from "./ui";

export function WithdrawForm() {
    const { address, isConnected } = useAccount();
    const [lockId, setLockId] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawRecipient, setWithdrawRecipient] = useState("");

    const {
        enableForcedWithdrawal,
        disableForcedWithdrawal,
        forcedWithdrawal,
        isPending,
        isSuccess
    } = useWithdraw();

    const { data: lockDetails } = useReadContract({
        address: THE_COMPACT_ADDRESS as `0x${string}`,
        abi: THE_COMPACT_ABI,
        functionName: "getLockDetails",
        args: lockId ? [BigInt(lockId)] : undefined,
        query: { enabled: !!lockId },
    });

    const { data: balance } = useReadContract({
        address: THE_COMPACT_ADDRESS as `0x${string}`,
        abi: THE_COMPACT_ABI,
        functionName: "balanceOf",
        args: address && lockId ? [address, BigInt(lockId)] : undefined,
        query: { enabled: !!address && !!lockId },
    });

    const { data: withdrawalStatus } = useReadContract({
        address: THE_COMPACT_ADDRESS as `0x${string}`,
        abi: THE_COMPACT_ABI,
        functionName: "getForcedWithdrawalStatus",
        args: address && lockId ? [address, BigInt(lockId)] : undefined,
        query: { enabled: !!address && !!lockId },
    });

    const status = withdrawalStatus ? Number(withdrawalStatus[0]) : 0;
    const withdrawableAt = withdrawalStatus ? Number(withdrawalStatus[1]) : 0;
    const canWithdraw = useMemo(() => status === 2 || (status === 1 && Date.now() / 1000 >= withdrawableAt), [status, withdrawableAt]);

    const handleEnable = useCallback(() => enableForcedWithdrawal(lockId), [enableForcedWithdrawal, lockId]);
    const handleDisable = useCallback(() => disableForcedWithdrawal(lockId), [disableForcedWithdrawal, lockId]);
    const handleForcedWithdrawal = useCallback(() => forcedWithdrawal(lockId, withdrawRecipient, withdrawAmount), [forcedWithdrawal, lockId, withdrawRecipient, withdrawAmount]);

    const handleLockIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setLockId(e.target.value), []);
    const handleWithdrawAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setWithdrawAmount(e.target.value), []);
    const handleRecipientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setWithdrawRecipient(e.target.value), []);
    const handleMaxAmount = useCallback(() => balance && setWithdrawAmount(formatEther(balance)), [balance]);

    const isActuallyFinished = useMemo(() => (balance === BigInt(0) && (status === 1 || status === 2)) || isSuccess, [balance, status, isSuccess]);

    const progressSteps = useMemo(() => [
        {
            label: "Enable Forced Withdrawal",
            status: (status === 0 ? "upcoming" : "success") as "upcoming" | "success"
        },
        {
            label: "Wait for Reset Period",
            status: (status === 0 ? "upcoming" : (status === 1 && !canWithdraw ? "loading" : "success")) as "upcoming" | "loading" | "success"
        },
        {
            label: "Execute Withdrawal",
            status: (isActuallyFinished ? "success" : canWithdraw ? "loading" : "upcoming") as "success" | "loading" | "upcoming"
        }
    ], [status, canWithdraw, isActuallyFinished]);

    return (
        <Card title="Withdraw Assets">
            <div className="mb-4">
                <FormInput
                    label="Resource Lock ID"
                    value={lockId}
                    onChange={handleLockIdChange}
                    placeholder="Enter lock ID"
                    helperText="The ERC6909 token ID from your deposit"
                    className="font-mono text-sm"
                />
            </div>

            {lockDetails && lockId && (
                <div className="mb-6 space-y-4 animate-fade-in">
                    <div className="bg-surface-input/30 border border-surface-border rounded-card overflow-hidden">
                        <div className="bg-surface-input px-4 py-2 border-b border-surface-border flex justify-between items-center">
                            <h3 className="text-helper font-bold text-text-secondary uppercase tracking-widest">Active Lock Parameters</h3>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] text-text-muted font-bold uppercase">Asset</span>
                                <p className="text-sm font-mono truncate text-text-primary">
                                    {lockDetails[0] === "0x0000000000000000000000000000000000000000" ? "Native (ETH)" : formatAddress(lockDetails[0])}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-text-muted font-bold uppercase">Network Scope</span>
                                <p className="text-sm text-text-primary">
                                    {SCOPES[lockDetails[3] as keyof typeof SCOPES] || `Unknown`}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-text-muted font-bold uppercase">Reset Delay</span>
                                <p className="text-sm text-text-primary">
                                    {RESET_PERIODS[lockDetails[2] as keyof typeof RESET_PERIODS]?.label || `Unknown`}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-text-muted font-bold uppercase">Current Balance</span>
                                <p className="text-sm font-bold text-brand-primary">
                                    {balance ? formatEther(balance) : "0"} ETH
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {lockId && withdrawalStatus && (
                <div className="mb-8 space-y-8 animate-fade-in">
                    <div className="px-2">
                        <TransactionProgress steps={progressSteps} />
                    </div>

                    <div className={`relative overflow-hidden rounded-card border transition-all duration-300 ${status === 0 ? "bg-surface-input/20 border-surface-border" :
                        status === 1 ? "bg-yellow-900/10 border-yellow-700/30" :
                            "bg-status-success/10 border-status-success-border/30"
                        }`}>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${status === 0 ? "bg-text-muted" :
                                    status === 1 ? "bg-yellow-500 animate-pulse" :
                                        "bg-status-success-text"
                                    }`} />
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none mb-1">Workflow Status</p>
                                    <h4 className={`text-sm font-bold ${status === 0 ? "text-text-secondary" :
                                        status === 1 ? "text-yellow-400" :
                                            "text-status-success-text"
                                        }`}>
                                        {FORCED_WITHDRAWAL_STATUS[status as keyof typeof FORCED_WITHDRAWAL_STATUS]}
                                    </h4>
                                </div>
                            </div>
                            {status === 1 && (
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-yellow-500/50 uppercase tracking-wider mb-1">Maturity Date</p>
                                    <p className="text-xs text-yellow-400/80 font-mono">
                                        {new Date(withdrawableAt * 1000).toLocaleTimeString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {status === 0 && lockId && (
                <div className="mb-6 group">
                    <Button
                        onClick={handleEnable}
                        disabled={!isConnected || isPending}
                        loading={isPending}
                        className="w-full !bg-yellow-600 hover:!bg-yellow-500 shadow-lg shadow-yellow-900/20"
                        icon={<Clock className="w-4 h-4" />}
                    >
                        Step 1: Initiate Forced Withdrawal
                    </Button>
                    <p className="text-[11px] text-text-hint mt-3 text-center transition-colors group-hover:text-text-secondary">
                        Action required: Enable the withdrawal countdown to bypass the allocator.
                    </p>
                </div>
            )}

            {(status === 1 || status === 2) && lockId && (
                <>
                    <div className="mb-4">
                        <FormInput
                            label="Withdraw Amount"
                            value={withdrawAmount}
                            onChange={handleWithdrawAmountChange}
                            placeholder="0.0"
                            rightElement={
                                balance && (
                                    <button
                                        onClick={handleMaxAmount}
                                        className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer active:scale-95"
                                    >
                                        MAX
                                    </button>
                                )
                            }
                        />
                    </div>

                    <div className="mb-6">
                        <FormInput
                            label="Recipient Address"
                            value={withdrawRecipient}
                            onChange={handleRecipientChange}
                            placeholder="Leave empty for self"
                        />
                    </div>

                    <Button
                        onClick={handleForcedWithdrawal}
                        disabled={!isConnected || isPending || !withdrawAmount || !canWithdraw}
                        loading={isPending}
                        className="w-full"
                        size="lg"
                        icon={<ArrowUpFromLine className="w-5 h-5" />}
                    >
                        {!canWithdraw ? "Waiting for Reset..." : "Withdraw Funds"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleDisable}
                        disabled={isPending}
                        className="w-full mt-3"
                        icon={<XCircle className="w-4 h-4" />}
                    >
                        Cancel Countdown
                    </Button>
                </>
            )}
        </Card>
    );
}
