"use client";

import { TransactionProvider } from "@/context/TransactionContext";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
export default function Home() {
  return (
    <TransactionProvider>
      <main className="h-screen w-screen overflow-hidden flex bg-gray-50">
        {/* LEFT PANEL — 35% */}
        <div className="w-[35%] h-full flex-shrink-0 relative">
          <LeftPanel />
        </div>

        {/* VERTICAL DIVIDER — vivid gradient split */}
        <div className="w-[3px] h-full relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-violet-500 to-blue-500" />
          <div className="absolute inset-0 bg-violet-400/30 blur-md" />
        </div>

        {/* RIGHT PANEL — 65% */}
        <div className="flex-1 h-full">
          <RightPanel />
        </div>
      </main>
    </TransactionProvider>
  );
}
