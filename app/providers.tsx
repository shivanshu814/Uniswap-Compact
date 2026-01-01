"use client";

import { LockHistoryProvider, ToastProvider } from "@/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ToastContainer } from "../components/ToastContainer";
import { config } from "../config";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [mounted, setMounted] = useState(false);

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
