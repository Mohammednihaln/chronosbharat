"use client";

import { useState } from "react";
import { useTransaction } from "@/context/TransactionContext";

export default function MuleAccountPanel() {
    const { suspectedAccounts, confirmedMules } = useTransaction();
    const [activeTab, setActiveTab] = useState<"suspected" | "confirmed">("suspected");

    const hasSuspected = suspectedAccounts.length > 0;
    const hasConfirmed = confirmedMules.length > 0;

    if (!hasSuspected && !hasConfirmed) {
        return (
            <div className="rounded-xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🔎</span>
                        <h3 className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">
                            Mule Account Detection
                        </h3>
                    </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-center">
                    <p className="text-[10px] text-gray-400 font-medium">No suspicious accounts detected yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header + Tabs */}
            <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🔎</span>
                        <h3 className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">
                            Mule Account Detection
                        </h3>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab("suspected")}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === "suspected"
                                    ? "bg-orange-100 text-orange-600 border border-orange-200"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Suspected ({suspectedAccounts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("confirmed")}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === "confirmed"
                                    ? "bg-red-100 text-red-600 border border-red-200"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Confirmed Mule ({confirmedMules.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-h-[120px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                {activeTab === "suspected" && (
                    <div>
                        {suspectedAccounts.length === 0 ? (
                            <div className="px-4 py-3 text-center">
                                <p className="text-[10px] text-gray-400">No suspected accounts</p>
                            </div>
                        ) : (
                            suspectedAccounts.map((account) => (
                                <div
                                    key={account.receiver}
                                    className="px-4 py-2 border-b border-orange-100 bg-orange-50/30 flex items-center justify-between gap-2 hover:bg-orange-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px]">⚠️</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-orange-700 truncate">
                                                {account.receiver}
                                            </p>
                                            <p className="text-[8px] text-gray-400">
                                                From: {account.senders.join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-orange-600">
                                                {account.warnCount}/3 warnings
                                            </p>
                                            <p className="text-[8px] text-gray-400">
                                                Risk: {account.lastRiskScore}
                                            </p>
                                        </div>
                                        {/* Progress dots */}
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full ${account.warnCount >= i
                                                            ? "bg-orange-500"
                                                            : "bg-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "confirmed" && (
                    <div>
                        {confirmedMules.length === 0 ? (
                            <div className="px-4 py-3 text-center">
                                <p className="text-[10px] text-gray-400">No confirmed mule accounts</p>
                            </div>
                        ) : (
                            confirmedMules.map((mule) => (
                                <div
                                    key={mule}
                                    className="px-4 py-2 border-b border-red-100 bg-red-50/30 flex items-center justify-between gap-2 hover:bg-red-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px]">🚫</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-red-700">
                                                {mule}
                                            </p>
                                            <p className="text-[8px] text-gray-400">
                                                All transactions blocked
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                                        Blocked
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
