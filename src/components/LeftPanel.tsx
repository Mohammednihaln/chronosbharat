"use client";

import SenderApp from "@/components/SenderApp";
import ReceiverApp from "@/components/ReceiverApp";
import WarningModal from "@/components/WarningModal";

export default function LeftPanel() {
    return (
        <div className="h-full flex flex-col bg-white">
            {/* Panel Title Bar */}
            <div className="px-4 py-2.5 border-b-2 border-violet-400 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 flex-shrink-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white drop-shadow-sm">
                    ◆ Simulation Panel <span className="font-semibold text-white/80">(This is for simulation purpose only!)</span>
                </p>
            </div>

            {/* Two halves — 50/50 split */}
            <div className="flex-1 min-h-0 flex flex-col">
                {/* Top 50%: Sender App */}
                <div className="h-1/2 flex flex-col relative">
                    <div className="px-4 py-1.5 bg-blue-50/60 border-b border-blue-100 flex-shrink-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-500">
                            ▸ Sender App
                        </p>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.08) transparent" }}>
                        <SenderApp />
                    </div>
                    {/* Warning modal overlays the sender area */}
                    <WarningModal />
                </div>

                {/* HORIZONTAL DIVIDER */}
                <div className="h-[2px] w-full relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
                </div>

                {/* Bottom 50%: Mule Ops */}
                <div className="h-1/2 flex flex-col">
                    <div className="px-4 py-1.5 bg-red-50/60 border-b border-red-100 flex-shrink-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-red-500">
                            ▸ Mule Operations
                        </p>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.08) transparent" }}>
                        <ReceiverApp />
                    </div>
                </div>
            </div>
        </div>
    );
}
