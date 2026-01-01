"use client";

import { useDeposit, useToast } from "@/hooks";
import { ArrowDownToLine, CheckCircle, Coins } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
    RESET_PERIODS,
    copyToClipboard
} from "../utils";
import { Button, Card, Dropdown, FormInput } from "./ui";

export function DepositForm() {
    const { isConnected } = useAccount();
    const [depositType, setDepositType] = useState<"native" | "erc20">("native");
    const [amount, setAmount] = useState("");
    const [tokenAddress, setTokenAddress] = useState("");
    const [resetPeriod, setResetPeriod] = useState<number>(0);
    const [scope, setScope] = useState<number>(0);
    const [recipient, setRecipient] = useState("");
    const [lastLockId, setLastLockId] = useState<string | null>(null);

    const handleSuccess = useCallback((lockId: string) => setLastLockId(lockId), []);

    const { deposit, isPending, ethBalance } = useDeposit({
        onSuccess: handleSuccess
    });

    const resetPeriodOptions = useMemo(() =>
        Object.entries(RESET_PERIODS).map(([value, { label }]) => ({
            value: Number(value),
            label,
        })), []);

    const handleDeposit = useCallback(() => {
        deposit({
            type: depositType,
            amount,
            tokenAddress,
            resetPeriod,
            scope,
            recipient
        });
    }, [deposit, depositType, amount, tokenAddress, resetPeriod, scope, recipient]);

    const setNativeType = useCallback(() => setDepositType("native"), []);
    const setErc20Type = useCallback(() => setDepositType("erc20"), []);
    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value), []);
    const handleTokenAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(e.target.value), []);
    const handleRecipientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value), []);
    const handleResetPeriodChange = useCallback((v: string | number) => setResetPeriod(Number(v)), []);
    const setScopeMultichain = useCallback(() => setScope(0), []);
    const setScopeSpecific = useCallback(() => setScope(1), []);
    const handleMaxAmount = useCallback(() => ethBalance && setAmount(formatEther(ethBalance.value)), [ethBalance]);
    const { showToast } = useToast();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLockId = useCallback(async () => {
        if (!lastLockId) return;
        const success = await copyToClipboard(lastLockId);
        if (success) {
            setIsCopied(true);
            showToast("info", "Lock ID copied to clipboard!");
            setTimeout(() => setIsCopied(false), 2000);
        }
    }, [lastLockId, showToast]);

    return (
        <Card title="Deposit Assets">
            <div className="flex gap-2 mb-6">
                <Button
                    variant={depositType === "native" ? "primary" : "secondary"}
                    onClick={setNativeType}
                    className="flex-1"
                    icon={<Coins className="w-4 h-4" />}
                >
                    Native (ETH)
                </Button>
                <Button
                    variant={depositType === "erc20" ? "primary" : "secondary"}
                    onClick={setErc20Type}
                    className="flex-1"
                >
                    ERC20 Token
                </Button>
            </div>

            {depositType === "erc20" && (
                <div className="mb-4">
                    <FormInput
                        label="Token Address"
                        value={tokenAddress}
                        onChange={handleTokenAddressChange}
                        placeholder="0x..."
                    />
                </div>
            )}

            <div className="mb-4">
                <FormInput
                    label="Amount"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.0"
                    helperText={ethBalance ? `Balance: ${formatEther(ethBalance.value)} ${ethBalance.symbol}` : ""}
                    rightElement={
                        <button
                            className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer active:scale-95"
                            onClick={handleMaxAmount}
                        >
                            MAX
                        </button>
                    }
                />
            </div>

            <div className="mb-4">
                <label className="block text-label font-medium text-text-secondary mb-2">Reset Period</label>
                <Dropdown
                    options={resetPeriodOptions}
                    value={resetPeriod}
                    onChange={handleResetPeriodChange}
                />
            </div>

            <div className="mb-4">
                <label className="block text-label font-medium text-text-secondary mb-2">Scope</label>
                <div className="flex gap-3">
                    <Button
                        variant={scope === 0 ? "outline" : "secondary"}
                        onClick={setScopeMultichain}
                        className={`flex-1 ${scope === 0 ? "!border-brand-primary !text-brand-primary" : ""}`}
                    >
                        Multichain
                    </Button>
                    <Button
                        variant={scope === 1 ? "outline" : "secondary"}
                        onClick={setScopeSpecific}
                        className={`flex-1 ${scope === 1 ? "!border-brand-primary !text-brand-primary" : ""}`}
                    >
                        Chain-Specific
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <FormInput
                    label="Recipient (optional)"
                    value={recipient}
                    onChange={handleRecipientChange}
                    placeholder="Leave empty for self"
                />
            </div>

            <Button
                onClick={handleDeposit}
                disabled={!isConnected || isPending || !amount}
                loading={isPending}
                className="w-full"
                size="lg"
                icon={<ArrowDownToLine className="w-5 h-5" />}
            >
                {!isConnected ? "Connect Wallet" : isPending ? "Confirming..." : "Deposit"}
            </Button>

            {lastLockId && (
                <div className="mt-4 p-4 bg-status-success/20 border border-status-success-border rounded-btn animate-fade-in">
                    <p className="text-sm text-status-success-text mb-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Last Deposit Lock ID:
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="text-helper bg-surface-card px-2 py-1 rounded font-mono truncate flex-1">
                            {lastLockId}
                        </code>
                        <Button variant="secondary" size="sm" onClick={handleCopyLockId} className={isCopied ? "!text-status-success-text" : ""}>
                            {isCopied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
