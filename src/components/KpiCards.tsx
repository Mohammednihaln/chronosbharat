"use client";

import { useTransaction, FilterType } from "@/context/TransactionContext";

interface KpiCardProps {
    label: string;
    value: number;
    icon: string;
    gradient: string;
    borderColor: string;
    activeBorderColor: string;
    shadowColor: string;
    filterKey: FilterType;
    isActive: boolean;
    onClick: () => void;
}

function KpiCard({
    label,
    value,
    icon,
    gradient,
    borderColor,
    activeBorderColor,
    shadowColor,
    isActive,
    onClick,
}: KpiCardProps) {
    return (
        <div
            onClick={onClick}
            className={`relative rounded-xl border-2 bg-white p-3 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${shadowColor} ${isActive
                    ? `${activeBorderColor} shadow-lg scale-[1.03]`
                    : `${borderColor} hover:scale-[1.02]`
                }`}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-current to-transparent">
                    <div className={`h-full bg-gradient-to-r ${gradient}`} />
                </div>
            )}

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        {label}
                    </p>
                    <p className="text-2xl font-extrabold text-gray-800 mt-0.5 tabular-nums">
                        {value.toLocaleString()}
                    </p>
                </div>
                <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-base shadow-md`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function KpiCards() {
    const { totalTx, blockedTx, suspiciousTx, safeTx, filterType, setFilterType } = useTransaction();

    const handleClick = (type: FilterType) => {
        // Toggle: click same card again to reset to "all"
        setFilterType(filterType === type ? "all" : type);
    };

    return (
        <div className="grid grid-cols-4 gap-2.5">
            <KpiCard
                label="Total Transactions"
                value={totalTx}
                icon="📊"
                gradient="from-blue-500 to-cyan-400"
                borderColor="border-blue-200"
                activeBorderColor="border-blue-500"
                shadowColor="shadow-blue-100"
                filterKey="all"
                isActive={filterType === "all"}
                onClick={() => handleClick("all")}
            />
            <KpiCard
                label="Blocked"
                value={blockedTx}
                icon="🛡️"
                gradient="from-red-500 to-rose-400"
                borderColor="border-red-200"
                activeBorderColor="border-red-500"
                shadowColor="shadow-red-100"
                filterKey="blocked"
                isActive={filterType === "blocked"}
                onClick={() => handleClick("blocked")}
            />
            <KpiCard
                label="Suspicious"
                value={suspiciousTx}
                icon="🔍"
                gradient="from-amber-500 to-yellow-400"
                borderColor="border-amber-200"
                activeBorderColor="border-amber-500"
                shadowColor="shadow-amber-100"
                filterKey="suspicious"
                isActive={filterType === "suspicious"}
                onClick={() => handleClick("suspicious")}
            />
            <KpiCard
                label="Safe"
                value={safeTx}
                icon="✅"
                gradient="from-emerald-500 to-green-400"
                borderColor="border-emerald-200"
                activeBorderColor="border-emerald-500"
                shadowColor="shadow-emerald-100"
                filterKey="safe"
                isActive={filterType === "safe"}
                onClick={() => handleClick("safe")}
            />
        </div>
    );
}
