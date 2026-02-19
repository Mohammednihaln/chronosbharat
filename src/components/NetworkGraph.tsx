"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTransaction } from "@/context/TransactionContext";

// Dynamically import ForceGraph2D with no SSR (canvas-based)
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
});

interface GraphNode {
    id: string;
    group: "sender" | "receiver" | "mule";
    val: number; // radius
    risk?: number;
}

interface GraphLink {
    source: string;
    target: string;
    value: number; // amount
}

export default function NetworkGraph() {
    const { transactions, confirmedMules, suspectedAccounts } = useTransaction();
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 400, h: 300 });

    const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
        nodes: [],
        links: [],
    });

    useEffect(() => {
        if (!containerRef.current) return;
        setDimensions({
            w: containerRef.current.clientWidth,
            h: containerRef.current.clientHeight,
        });

        // Resize observer to keep graph responsive
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    w: entry.contentRect.width,
                    h: entry.contentRect.height,
                });
            }
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Transform transactions into graph data
    useEffect(() => {
        const nodesMap = new Map<string, GraphNode>();
        const links: GraphLink[] = [];

        // Limit to recent 50 transactions to keep graph readable
        const recentTx = transactions.slice(0, 50);

        recentTx.forEach((tx) => {
            // Source (Sender)
            if (!nodesMap.has(tx.sender)) {
                nodesMap.set(tx.sender, {
                    id: tx.sender,
                    group: "sender",
                    val: 4,
                });
            }

            // Target (Receiver)
            if (!nodesMap.has(tx.receiver)) {
                const isMule = confirmedMules.includes(tx.receiver);
                const isSuspected = suspectedAccounts.some(s => s.receiver === tx.receiver);

                nodesMap.set(tx.receiver, {
                    id: tx.receiver,
                    group: isMule ? "mule" : "receiver",
                    val: isMule || isSuspected ? 6 : 4,
                    risk: tx.risk_score,
                });
            }

            links.push({
                source: tx.sender,
                target: tx.receiver,
                value: tx.amount,
            });
        });

        setGraphData({
            nodes: Array.from(nodesMap.values()),
            links: links,
        });
    }, [transactions, confirmedMules, suspectedAccounts]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-700 shadow-inner">
            {/* Overlay Title */}
            <div className="absolute top-3 left-4 z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <h3 className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">
                        Visual Link Analysis
                    </h3>
                </div>
                <p className="text-[9px] text-cyan-800/80 font-mono mt-0.5">
                    {graphData.nodes.length} Nodes • {graphData.links.length} Links
                </p>
            </div>

            {/* Empty State */}
            {graphData.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-slate-600 text-xs font-mono">Waiting for live data...</p>
                </div>
            )}

            <ForceGraph2D
                width={dimensions.w}
                height={dimensions.h}
                graphData={graphData}
                nodeLabel="id"
                nodeColor={(node: any) => {
                    if (node.group === "mule") return "#ef4444"; // Red
                    if (node.group === "receiver") return "#f97316"; // Orange
                    return "#10b981"; // Emerald
                }}
                linkColor={() => "rgba(100, 116, 139, 0.4)"} // Slate-500 optimized
                backgroundColor="#0f172a" // Slate-900
                nodeRelSize={4}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleColor={() => "#38bdf8"} // Sky-400 particles
                d3VelocityDecay={0.6} // Stabilize quick
                cooldownTicks={100}
            />
        </div>
    );
}
