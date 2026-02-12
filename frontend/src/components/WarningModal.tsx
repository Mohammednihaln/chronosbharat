"use client";

import { useTransaction } from "@/context/TransactionContext";

export default function WarningModal() {
    const { pendingTx, confirmPending, cancelPending } = useTransaction();

    if (!pendingTx) return null;

    const riskLevel =
        pendingTx.risk_score >= 70
            ? { label: "HIGH RISK", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
            : { label: "MEDIUM RISK", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };

    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 w-[90%] max-h-[95%] overflow-y-auto">
                {/* Risk banner */}
                <div className={`px-4 py-2 ${riskLevel.bg} border-b ${riskLevel.border} flex items-center gap-2 rounded-t-xl`}>
                    <span className="text-base">⚠️</span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${riskLevel.color}`}>
                        {riskLevel.label} — Score {pendingTx.risk_score}/100
                    </span>
                </div>

                {/* Content */}
                <div className="px-4 py-3 space-y-3">
                    <h2 className="text-sm font-extrabold text-gray-800">
                        Payment Warning
                    </h2>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                            Our system detected <span className="font-bold text-red-600">unusual patterns</span> in this transaction.
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                            Are you being pressured to send this money?
                        </p>
                    </div>

                    {/* Transaction details */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-1">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400 font-medium">To</span>
                            <span className="text-gray-800 font-bold">{pendingTx.receiver}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400 font-medium">Amount</span>
                            <span className="text-gray-800 font-bold">₹{pendingTx.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400 font-medium">Remark</span>
                            <span className="text-gray-800 font-bold">{pendingTx.remark}</span>
                        </div>
                    </div>

                    {/* Risk factors */}
                    <div className="space-y-1">
                        <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider">Flagged Factors</p>
                        {pendingTx.factors
                            .filter((f) => f.score >= 20)
                            .map((factor) => (
                                <div key={factor.name} className="flex items-center gap-1.5 text-[10px]">
                                    <span className="text-red-500 text-[8px]">●</span>
                                    <span className="text-gray-700 font-semibold">{factor.name}</span>
                                    <span className="text-gray-300">—</span>
                                    <span className="text-gray-500 truncate text-[9px]">{factor.description}</span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="px-4 pb-3 flex flex-col gap-1.5">
                    <button
                        onClick={cancelPending}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                        ❌ Cancel Payment
                    </button>
                    <a
                        href="tel:1930"
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 no-underline"
                    >
                        📞 Get Help (1930)
                    </a>
                    <button
                        onClick={confirmPending}
                        className="w-full py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 font-semibold text-[10px] hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                        ✅ Proceed Anyway
                    </button>
                </div>
            </div>
        </div>
    );
}
