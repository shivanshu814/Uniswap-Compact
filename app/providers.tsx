"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ToastContainer } from "./components/ToastContainer";
import { config } from "./config";
import { LockHistoryProvider } from "./hooks/useLockHistory";
import { ToastProvider } from "./hooks/useToast";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [mounted, setMounted] = useState(false);

    // Prevents Hydration Mismatch errors from Wagmi/RainbowKit
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider ToastUI={ToastContainer}>
                    <LockHistoryProvider>
                        {children}
                    </LockHistoryProvider>
                </ToastProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
