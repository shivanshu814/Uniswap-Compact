"use client";

import { AlertCircle, Check, Info, Loader2, X } from "lucide-react";
import type { Toast } from "../types";

const iconMap = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    loading: <Loader2 className="w-5 h-5 animate-spin" />,
};

const colorMap = {
    success: "bg-status-success/90 border-status-success-border text-status-success-text",
    error: "bg-status-error/90 border-status-error-border text-status-error-text",
    info: "bg-status-info/90 border-status-info-border text-status-info-text",
    loading: "bg-surface-card/90 border-surface-border text-text-primary",
};

interface ToastContainerProps {
    toasts: Toast[];
    dismissToast: (id: number) => void;
}

export function ToastContainer({ toasts, dismissToast }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-btn shadow-lg border backdrop-blur-sm animate-slide-in ${colorMap[toast.type]}`}
                >
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0">{iconMap[toast.type]}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{toast.message}</p>
                            {toast.txHash && (
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${toast.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-helper underline opacity-70 hover:opacity-100"
                                >
                                    View on Etherscan →
                                </a>
                            )}
                        </div>
                        <button onClick={() => dismissToast(toast.id)} className="flex-shrink-0 opacity-50 hover:opacity-100">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
