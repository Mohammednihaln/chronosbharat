"use client";

import { useTransaction } from "@/context/TransactionContext";

export default function RiskExplanationPanel() {
    const { selectedTx } = useTransaction();

    if (!selectedTx) {
        return (
            <div className="rounded-xl border-2 border-gray-200 bg-white p-4 flex items-center justify-center h-full shadow-sm">
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-400">Click a transaction to view</p>
                    <p className="text-xs text-gray-300 mt-1">Explainable AI Risk Breakdown</p>
                </div>
            </div>
        );
    }

    const isBlocked = selectedTx.verdict === "BLOCKED";
    const isSuspicious = selectedTx.verdict === "SUSPICIOUS";
    const scoreColor = isBlocked ? "text-red-600" : isSuspicious ? "text-amber-600" : "text-emerald-600";
    const ringColor = isBlocked ? "stroke-red-500" : isSuspicious ? "stroke-amber-500" : "stroke-emerald-500";
    const bgGlow = isBlocked ? "bg-red-100" : isSuspicious ? "bg-amber-100" : "bg-emerald-100";

    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (selectedTx.risk_score / 100) * circumference;

    return (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4 flex flex-col gap-3 h-full relative overflow-hidden shadow-sm">
            {/* Background accent */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${bgGlow} rounded-full blur-3xl opacity-40`} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">
                    Risk Analysis
                </h3>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${selectedTx.verdict === "BLOCKED" ? "text-red-600 bg-red-100" : selectedTx.verdict === "SUSPICIOUS" ? "text-amber-600 bg-amber-100" : "text-emerald-600 bg-emerald-100"
                    }`}>
                    {selectedTx.verdict}
                </span>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100" />
                        <circle
                            cx="50" cy="50" r="40" fill="none" strokeWidth="6" strokeLinecap="round"
                            className={ringColor}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-lg font-extrabold tabular-nums ${scoreColor}`}>
                            {selectedTx.risk_score}
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 font-bold truncate">
                        {selectedTx.sender} → {selectedTx.receiver}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                        ₹{selectedTx.amount.toLocaleString()} • {selectedTx.remark}
                    </p>
                </div>
            </div>

            {/* Factor Bars */}
            <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                    Risk Factors
                </p>
                {selectedTx.factors.map((factor) => {
                    const pct = Math.min(factor.score, 100);
                    const barColor =
                        pct >= 70
                            ? "bg-gradient-to-r from-red-500 to-rose-400"
                            : pct >= 40
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                : "bg-gradient-to-r from-emerald-500 to-green-400";
                    return (
                        <div key={factor.name} className="space-y-0.5">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-700 font-semibold">{factor.name}</span>
                                <span className="text-[9px] text-gray-400 tabular-nums font-bold">{factor.score}</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${barColor} transition-all duration-700`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-[8px] text-gray-400 font-medium">{factor.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
