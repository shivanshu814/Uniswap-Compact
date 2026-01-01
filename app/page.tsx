"use client";

import { useState } from "react";
import { ConnectButton } from "./components/ConnectButton";
import { DepositForm } from "./components/DepositForm";
import { WithdrawForm } from "./components/WithdrawForm";
import { THE_COMPACT_ADDRESS } from "./config";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤝</span>
            <div>
              <h1 className="text-xl font-bold">The Compact</h1>
              <p className="text-xs text-gray-500 font-mono">
                {THE_COMPACT_ADDRESS.slice(0, 10)}...
              </p>
            </div>
          </div>
          <ConnectButton />
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-4 rounded-xl font-medium text-lg transition-colors ${
              activeTab === "deposit"
                ? "bg-pink-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-4 rounded-xl font-medium text-lg transition-colors ${
              activeTab === "withdraw"
                ? "bg-pink-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Content */}
        {activeTab === "deposit" ? <DepositForm /> : <WithdrawForm />}

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            How it works
          </h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>
              • <strong>Deposit:</strong> Lock tokens with an allocator, reset
              period, and scope
            </li>
            <li>
              • <strong>Withdraw:</strong> Use forced withdrawal (enable → wait
              → withdraw)
            </li>
            <li>
              • <strong>Custom Recipient:</strong> Withdraw to any address ✓
            </li>
          </ul>
          <p className="text-xs text-gray-600 mt-3">
            Contract:{" "}
            <a
              href={`https://etherscan.io/address/${THE_COMPACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:underline font-mono"
            >
              {THE_COMPACT_ADDRESS}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
