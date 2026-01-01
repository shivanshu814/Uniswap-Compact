"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function ConnectButton() {
    const { address, isConnected, chain } = useAccount();
    const { connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <button
                disabled
                className="bg-pink-600 opacity-50 text-white px-6 py-2 rounded-xl font-medium"
            >
                Loading...
            </button>
        );
    }

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                    {chain?.name || "Unknown"}
                </span>
                <button
                    onClick={() => disconnect()}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-colors border border-gray-700"
                >
                    {address.slice(0, 6)}...{address.slice(-4)}
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-colors"
        >
            {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
    );
}
