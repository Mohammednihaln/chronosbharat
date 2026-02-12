"use client";

import { useTransaction, ScoredTransaction } from "@/context/TransactionContext";
import { useMemo } from "react";

export default function LiveTransactionTable() {
    const { transactions, setSelectedTx, selectedTx, filterType } = useTransaction();

    const filteredTransactions = useMemo(() => {
        switch (filterType) {
            case "blocked":
                return transactions.filter((t) => t.verdict === "BLOCKED");
            case "suspicious":
                return transactions.filter((t) => t.verdict === "SUSPICIOUS");
            case "safe":
                return transactions.filter((t) => t.verdict === "SAFE");
            default:
                return transactions;
        }
    }, [transactions, filterType]);

    const filterLabel =
        filterType === "all"
            ? "All Transactions"
            : filterType === "blocked"
                ? "Blocked Only"
                : filterType === "suspicious"
                    ? "Suspicious Only"
                    : "Safe Only";

    return (
        <div className="rounded-xl border-2 border-gray-200 bg-white overflow-hidden flex flex-col shadow-sm">
            {/* Table Header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 bg-gray-50/50">
                <div className="grid grid-cols-[32px_1fr_1fr_80px_60px_64px] gap-1.5 flex-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">#</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Sender</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Receiver</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase text-right">Amount</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase text-center">Risk</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase text-center">Verdict</span>
                </div>
            </div>

            {/* Active filter label */}
            {filterType !== "all" && (
                <div className="px-3 py-1 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                        Filter: {filterLabel}
                    </span>
                    <span className="text-[9px] text-gray-400">
                        ({filteredTransactions.length} results)
                    </span>
                </div>
            )}

            {/* Scrollable Body */}
            <div className="overflow-y-auto max-h-[180px]" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.1) transparent" }}>
                {filteredTransactions.length === 0 ? (
                    <div className="flex items-center justify-center h-16">
                        <p className="text-[10px] text-gray-400 font-medium">
                            {transactions.length === 0
                                ? "No transactions yet — send one from the Sender App"
                                : `No ${filterType} transactions found`}
                        </p>
                    </div>
                ) : (
                    filteredTransactions.map((tx: ScoredTransaction, idx: number) => {
                        const isBlocked = tx.verdict === "BLOCKED";
                        const isSuspicious = tx.verdict === "SUSPICIOUS";
                        const isSelected = selectedTx?.tx_id === tx.tx_id;

                        return (
                            <div
                                key={tx.tx_id}
                                onClick={() => setSelectedTx(tx)}
                                className={`grid grid-cols-[32px_1fr_1fr_80px_60px_64px] gap-1.5 px-3 py-2 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isSelected ? "bg-blue-50 border-l-3 border-l-blue-500" : ""
                                    } ${isBlocked
                                        ? "bg-red-50/50 hover:bg-red-50"
                                        : isSuspicious
                                            ? "bg-amber-50/50 hover:bg-amber-50"
                                            : "bg-emerald-50/30 hover:bg-emerald-50/50"
                                    }`}
                            >
                                <span className="text-[10px] text-gray-400 tabular-nums font-medium">
                                    {filteredTransactions.length - idx}
                                </span>
                                <span className="text-[10px] text-gray-800 truncate font-medium">{tx.sender}</span>
                                <span className="text-[10px] text-gray-500 truncate font-medium">{tx.receiver}</span>
                                <span className="text-[10px] text-gray-800 text-right font-bold tabular-nums">
                                    ₹{tx.amount.toLocaleString()}
                                </span>
                                <div className="flex justify-center">
                                    <span
                                        className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full ${isBlocked
                                                ? "text-red-600 bg-red-100"
                                                : isSuspicious
                                                    ? "text-amber-600 bg-amber-100"
                                                    : "text-emerald-600 bg-emerald-100"
                                            }`}
                                    >
                                        {tx.risk_score}
                                    </span>
                                </div>
                                <div className="flex justify-center">
                                    <span
                                        className={`text-[9px] font-extrabold uppercase tracking-wider ${isBlocked
                                                ? "text-red-600"
                                                : isSuspicious
                                                    ? "text-amber-600"
                                                    : "text-emerald-600"
                                            }`}
                                    >
                                        {tx.verdict}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
