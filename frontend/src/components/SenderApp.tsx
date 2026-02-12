"use client";

import { useState } from "react";
import { useTransaction } from "@/context/TransactionContext";

const MOCK_SENDERS = [
    { name: "Aarav Sharma", upi: "aarav@xyzbank" },
    { name: "Priya Patel", upi: "priya@abcbank" },
    { name: "Rohan Singh", upi: "rohan@pqrbank" },
];

const MOCK_RECEIVERS = [
    { name: "Sneha Gupta", upi: "sneha@lmnbank" },
    { name: "Vikram Reddy", upi: "vikram@defbank" },
    { name: "Arjun Mehta", upi: "arjun@xyzbank" },
    { name: "Kiran Rao", upi: "kiran@abcbank" },
    { name: "Deepak Kumar", upi: "deepak@pqrbank" },
];

export default function SenderApp() {
    const { toggles, sendTransaction, lastResult, blockedMessage, clearBlockedMessage, isReceiverBlocked } =
        useTransaction();
    const [selectedSender, setSelectedSender] = useState("");
    const [selectedReceiver, setSelectedReceiver] = useState("");
    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");
    const [showResult, setShowResult] = useState(false);

    const handlePay = () => {
        const sender = MOCK_SENDERS.find((u) => u.upi === selectedSender);
        const receiver = MOCK_RECEIVERS.find((u) => u.upi === selectedReceiver);
        if (!sender || !receiver || !amount) return;

        clearBlockedMessage();

        sendTransaction({
            sender: `${sender.name} (${sender.upi})`,
            receiver: receiver.upi,
            amount: parseFloat(amount),
            remark: remark || "Payment",
            toggles,
        });

        setShowResult(true);
        setTimeout(() => {
            setShowResult(false);
            clearBlockedMessage();
        }, 6000);
    };

    const receiverBlocked = selectedReceiver ? isReceiverBlocked(selectedReceiver) : false;

    return (
        <div className="flex flex-col p-3 gap-2">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                    <span className="text-white text-xs font-bold">₹</span>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-800 leading-tight">UPI Payment</h2>
                    <p className="text-[9px] text-gray-400 font-medium">Sender Simulator</p>
                </div>
            </div>

            {/* Blocked Receiver Message */}
            {blockedMessage && (
                <div className="rounded-lg p-2.5 bg-red-50 border-2 border-red-300 text-xs text-red-700 font-semibold leading-relaxed">
                    <div className="flex items-start gap-2">
                        <span className="text-sm flex-shrink-0">🚫</span>
                        <div>
                            <p className="font-bold text-red-800 text-[10px] mb-0.5">Mule Account Detected</p>
                            <p className="text-[9px] text-red-600 leading-relaxed">
                                This receiver is a <span className="font-extrabold">Confirmed Mule Account</span>.
                                Transaction auto-blocked and logged.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Sender */}
            <div className="space-y-0.5">
                <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">From (Sender)</label>
                <select
                    value={selectedSender}
                    onChange={(e) => setSelectedSender(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer font-medium"
                >
                    <option value="">Select Sender</option>
                    {MOCK_SENDERS.map((u) => (
                        <option key={u.upi} value={u.upi}>{u.name} ({u.upi})</option>
                    ))}
                </select>
            </div>

            {/* Receiver */}
            <div className="space-y-0.5">
                <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">To (Receiver)</label>
                <select
                    value={selectedReceiver}
                    onChange={(e) => setSelectedReceiver(e.target.value)}
                    className={`w-full rounded-lg border-2 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 outline-none focus:ring-2 transition-all appearance-none cursor-pointer font-medium ${receiverBlocked
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                        }`}
                >
                    <option value="">Select Receiver</option>
                    {MOCK_RECEIVERS.map((u) => (
                        <option key={u.upi} value={u.upi}>{u.name} ({u.upi})</option>
                    ))}
                </select>
                {receiverBlocked && (
                    <p className="text-[8px] text-red-500 font-bold">⚠ This account is a confirmed mule — payment will be blocked</p>
                )}
            </div>

            {/* Amount */}
            <div className="space-y-0.5">
                <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Amount (₹)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-bold text-xs">₹</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 pl-7 pr-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 font-medium"
                    />
                </div>
            </div>

            {/* Remark */}
            <div className="space-y-0.5">
                <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Remark</label>
                <input
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter a note..."
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 font-medium"
                />
            </div>

            {/* Pay Button */}
            <button
                onClick={handlePay}
                disabled={!selectedSender || !selectedReceiver || !amount}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
                Pay ₹{amount || "0"}
            </button>

            {/* Result Toast */}
            {!blockedMessage && showResult && lastResult && (
                <div
                    className={`rounded-lg p-2 text-center text-xs font-bold ${lastResult.verdict === "BLOCKED"
                            ? "bg-red-50 border-2 border-red-200 text-red-600"
                            : lastResult.verdict === "SUSPICIOUS"
                                ? "bg-amber-50 border-2 border-amber-200 text-amber-600"
                                : "bg-emerald-50 border-2 border-emerald-200 text-emerald-600"
                        }`}
                >
                    {lastResult.verdict === "BLOCKED"
                        ? `🚫 Blocked — Risk Score: ${lastResult.risk_score}`
                        : lastResult.verdict === "SUSPICIOUS"
                            ? `⚠️ Suspicious — Risk Score: ${lastResult.risk_score}`
                            : `✅ ₹${lastResult.amount} sent successfully`}
                </div>
            )}
        </div>
    );
}
