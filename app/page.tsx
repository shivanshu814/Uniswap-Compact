"use client";

import { Handshake } from "lucide-react";
import { useState } from "react";
import { ConnectButton } from "./components/ConnectButton";
import { DepositForm } from "./components/DepositForm";
import { LockHistory } from "./components/LockHistory";
import { WithdrawForm } from "./components/WithdrawForm";
import { THE_COMPACT_ADDRESS } from "./utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "history">("deposit");

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Handshake className="w-8 h-8 text-brand-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">The Compact</h1>
              <p className="text-xs text-gray-500 font-mono">Sepolia Testnet</p>
            </div>
          </div>
          <ConnectButton />
        </header>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${activeTab === "deposit"
              ? "bg-pink-600 text-white"
              : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
              }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${activeTab === "withdraw"
              ? "bg-pink-600 text-white"
              : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
              }`}
          >
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${activeTab === "history"
              ? "bg-pink-600 text-white"
              : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
              }`}
          >
            History
          </button>
        </div>

        {activeTab === "deposit" && <DepositForm />}
        {activeTab === "withdraw" && <WithdrawForm />}
        {activeTab === "history" && <LockHistory />}

        <div className="mt-8 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <h3 className="text-sm font-medium text-gray-300 mb-2">How it works</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• <strong>Deposit:</strong> Lock tokens with reset period</li>
            <li>• <strong>Withdraw:</strong> Enable → Wait → Withdraw</li>
            <li>• <strong>History:</strong> Copy Lock IDs for withdrawal</li>
          </ul>
          <p className="text-xs text-gray-600 mt-3">
            Contract:{" "}
            <a
              href={`https://sepolia.etherscan.io/address/${THE_COMPACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:underline font-mono"
            >
              {THE_COMPACT_ADDRESS.slice(0, 10)}...
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
