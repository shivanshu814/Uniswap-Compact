"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import type { LockEntry, LockHistoryContextType } from "../types";

const LockHistoryContext = createContext<LockHistoryContextType | null>(null);

export function useLockHistory() {
    const context = useContext(LockHistoryContext);
    if (!context) throw new Error("useLockHistory must be used within LockHistoryProvider");
    return context;
}

export function LockHistoryProvider({ children }: { children: ReactNode }) {
    const [locks, setLocks] = useState<LockEntry[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("compact-lock-history");
        if (stored) {
            try { setLocks(JSON.parse(stored)); } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("compact-lock-history", JSON.stringify(locks));
    }, [locks]);

    const addLock = useCallback((lock: Omit<LockEntry, "timestamp">) => {
        setLocks((prev) => [{ ...lock, timestamp: Date.now() }, ...prev].slice(0, 20));
    }, []);

    const clearHistory = useCallback(() => setLocks([]), []);

    return (
        <LockHistoryContext.Provider value={{ locks, addLock, clearHistory }}>
            {children}
        </LockHistoryContext.Provider>
    );
}
