"use client";

import { ArrowDown, Copy, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLockHistory, useToast } from "@/hooks";
import { copyToClipboard, formatTimestamp } from "../utils";
import { Button, Card } from "./ui";

export function LockHistory() {
    const { locks, clearHistory } = useLockHistory();
    const [copied, setCopied] = useState<string | null>(null);

    const { showToast } = useToast();
    const handleCopy = async (id: string) => {
        const success = await copyToClipboard(id);
        if (success) {
            setCopied(id);
            showToast("info", "Lock ID copied to clipboard!");
            setTimeout(() => setCopied(null), 2000);
        }
    };

    if (locks.length === 0) {
        return (
            <Card className="text-center">
                <div className="py-8">
                    <ArrowDown className="w-12 h-12 mx-auto text-text-muted mb-4" />
                    <p className="text-text-secondary">No transactions yet</p>
                    <p className="text-helper text-text-hint mt-2">
                        Your deposit and withdrawal history will appear here
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <Button variant="ghost" size="sm" onClick={clearHistory} icon={<Trash2 className="w-4 h-4" />}>
                    Clear
                </Button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
                {locks.map((lock, i) => (
                    <div key={lock.txHash + i} className="bg-surface-input border border-surface-border rounded-btn p-3">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-helper font-medium px-2 py-1 rounded ${lock.type === "deposit"
                                ? "bg-status-success/30 text-status-success-text"
                                : "bg-brand-primary/30 text-brand-primary"
                                }`}>
                                {lock.type === "deposit" ? "↓ Deposit" : "↑ Withdraw"}
                            </span>
                            <span className="text-helper text-text-hint">
                                {formatTimestamp(lock.timestamp)}
                            </span>
                        </div>

                        <p className="text-sm font-medium mb-2">{lock.amount} ETH</p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-text-secondary text-helper">Lock ID:</span>
                                <code className="text-helper bg-surface-card px-2 py-1 rounded font-mono truncate max-w-[180px]">
                                    {lock.id.slice(0, 10)}...{lock.id.slice(-6)}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopy(lock.id)}
                                    className="!p-1"
                                >
                                    {copied === lock.id ? (
                                        <span className="text-status-success-text text-helper">✓</span>
                                    ) : (
                                        <Copy className="w-3 h-3" />
                                    )}
                                </Button>
                            </div>

                            <a
                                href={`https://sepolia.etherscan.io/tx/${lock.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-helper text-brand-primary hover:underline flex items-center gap-1"
                            >
                                View Tx <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
