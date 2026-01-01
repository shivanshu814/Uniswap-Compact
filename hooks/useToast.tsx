"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import type { Toast, ToastContextType } from "../types";

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}

export function ToastProvider({ children, ToastUI }: { children: ReactNode; ToastUI: React.ComponentType<{ toasts: Toast[]; dismissToast: (id: number) => void }> }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: Toast["type"], message: string, txHash?: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message, txHash }]);
        if (type !== "loading") setTimeout(() => dismissToast(id), 5000);
        return id;
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const updateToast = useCallback((id: number, type: Toast["type"], message: string, txHash?: string) => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, type, message, txHash } : t));
        if (type !== "loading") setTimeout(() => dismissToast(id), 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast, updateToast }}>
            {children}
            <ToastUI toasts={toasts} dismissToast={dismissToast} />
        </ToastContext.Provider>
    );
}
