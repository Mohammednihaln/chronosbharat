"use client";

import { useState } from "react";
import KpiCards from "@/components/KpiCards";
import LiveTransactionTable from "@/components/LiveTransactionTable";
import RiskExplanationPanel from "@/components/RiskExplanationPanel";
import VelocityChart from "@/components/VelocityChart";
import MuleAccountPanel from "@/components/MuleAccountPanel";
import NetworkGraph from "@/components/NetworkGraph";
import { useTransaction } from "@/context/TransactionContext";

export default function RightPanel() {
    const { wsConnected } = useTransaction();
    const [viewMode, setViewMode] = useState<"velocity" | "graph">("graph");

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20 overflow-hidden">
            {/* Panel Title Bar */}
            <div className="px-5 py-2.5 border-b border-gray-200 bg-white flex items-center gap-3 flex-shrink-0 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-md shadow-blue-300" />
                <h1 className="text-sm font-extrabold tracking-wide text-gray-800 uppercase">
                    CHRONOS-BHARAT
                </h1>
                <div className="h-4 w-px bg-gray-300" />
                <span className="text-[10px] text-blue-600 font-bold tracking-wider">LIVE</span>

                <div className="ml-auto flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${wsConnected ? "bg-emerald-500 shadow-sm shadow-emerald-300" : "bg-red-500 animate-pulse shadow-sm shadow-red-300"}`} />
                    <span className="text-[10px] font-semibold text-gray-500">
                        {wsConnected ? "Connected" : "Reconnecting…"}
                    </span>
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-[10px] text-gray-400 font-medium">
                        Mission Control v1.0
                    </span>
                </div>
            </div>

            {/* Dashboard Content — scrollable */}
            <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.1) transparent" }}>
                {/* Mule Account Detection — above KPI cards */}
                <div className="flex-shrink-0">
                    <MuleAccountPanel />
                </div>

                {/* KPI Row */}
                <div className="flex-shrink-0">
                    <KpiCards />
                </div>

                {/* Transaction Table */}
                <div className="flex-shrink-0">
                    <LiveTransactionTable />
                </div>

                {/* Bottom row: Risk Panel + Chart/Graph */}
                <div className="flex-shrink-0 grid grid-cols-2 gap-3 min-h-[300px]">
                    <RiskExplanationPanel />
                    <div className="flex flex-col gap-2 h-full">
                        {/* View Toggles */}
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm w-fit self-end">
                            <button
                                onClick={() => setViewMode("velocity")}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === "velocity" ? "bg-blue-100 text-blue-700" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                Velocity
                            </button>
                            <button
                                onClick={() => setViewMode("graph")}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === "graph" ? "bg-violet-100 text-violet-700" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                Link Analysis
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                            {viewMode === "velocity" ? <VelocityChart /> : <NetworkGraph />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
