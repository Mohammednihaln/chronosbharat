"use client";

import { useTransaction } from "@/context/TransactionContext";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

export default function VelocityChart() {
    const { transactions } = useTransaction();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const chartData = useMemo(() => {
        const reversed = [...transactions].reverse();
        if (reversed.length === 0) {
            return [
                { label: "T1", score: 12 },
                { label: "T2", score: 8 },
                { label: "T3", score: 15 },
                { label: "T4", score: 6 },
                { label: "T5", score: 10 },
                { label: "T6", score: 14 },
                { label: "T7", score: 9 },
                { label: "T8", score: 11 },
                { label: "T9", score: 7 },
                { label: "T10", score: 13 },
            ];
        }
        return reversed.map((tx, i) => ({
            label: `Tx${i + 1}`,
            score: tx.risk_score,
        }));
    }, [transactions]);

    return (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-3 flex flex-col gap-2 h-full shadow-sm">
            <div className="flex items-center justify-between flex-shrink-0">
                <h3 className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">
                    Transaction Velocity
                </h3>
                <span className="text-[9px] text-gray-400 font-bold">
                    {transactions.length} total
                </span>
            </div>

            <div className="flex-1 min-h-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(0,0,0,0.05)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 8, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 8, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#ffffff",
                                    border: "2px solid #e5e7eb",
                                    borderRadius: "8px",
                                    fontSize: "10px",
                                    color: "#374151",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                                labelStyle={{ color: "#9ca3af" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                fill="url(#riskGradient)"
                                dot={false}
                                activeDot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-[10px] text-gray-400 font-medium">Loading chart...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
