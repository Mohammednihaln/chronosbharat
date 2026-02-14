"use client";

import { useTransaction } from "@/context/TransactionContext";
import { Switch } from "@/components/ui/switch";

interface ToggleItemProps {
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (val: boolean) => void;
    activeBorder: string;
    activeBg: string;
    activeText: string;
}

function ToggleItem({
    label,
    description,
    checked,
    onCheckedChange,
    activeBorder,
    activeBg,
    activeText,
}: ToggleItemProps) {
    return (
        <div
            className={`flex items-center justify-between rounded-lg border-2 px-3 py-2 transition-all duration-300 ${checked
                    ? `${activeBorder} ${activeBg}`
                    : "border-gray-100 bg-gray-50/50"
                }`}
        >
            <div className="flex-1 min-w-0 mr-3">
                <p className={`text-[11px] font-semibold ${checked ? activeText : "text-gray-700"}`}>
                    {label}
                </p>
                <p className="text-[9px] text-gray-400 truncate font-medium">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}

export default function ReceiverApp() {
    const { toggles, setToggles } = useTransaction();

    const updateToggle = (key: keyof typeof toggles, val: boolean) => {
        setToggles((prev) => ({ ...prev, [key]: val }));
    };

    return (
        <div className="flex flex-col p-3 gap-2.5">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-md shadow-red-200 flex-shrink-0">
                    <span className="text-white text-xs font-bold">⚠</span>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-red-600 leading-tight">Mule Ops Center</h2>
                    <p className="text-[9px] text-gray-400 font-medium">Fraud Evasion Toggles</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                    <div
                        className={`w-2.5 h-2.5 rounded-full ${Object.values(toggles).some(Boolean)
                                ? "bg-red-500 animate-pulse shadow-sm shadow-red-300"
                                : "bg-emerald-500 shadow-sm shadow-emerald-200"
                            }`}
                    />
                    <span className="text-[10px] font-bold text-gray-500">
                        {Object.values(toggles).filter(Boolean).length} active
                    </span>
                </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-1.5">
                <ToggleItem
                    label="Velocity Throttle"
                    description="Rapid micro-transactions burst pattern"
                    checked={toggles.velocity}
                    onCheckedChange={(v) => updateToggle("velocity", v)}
                    activeBorder="border-orange-300"
                    activeBg="bg-orange-50"
                    activeText="text-orange-600"
                />
                <ToggleItem
                    label="Geo-Spoofing"
                    description="Mismatched sender/receiver geography"
                    checked={toggles.geoSpoofing}
                    onCheckedChange={(v) => updateToggle("geoSpoofing", v)}
                    activeBorder="border-red-300"
                    activeBg="bg-red-50"
                    activeText="text-red-600"
                />
                <ToggleItem
                    label="Account Warming"
                    description="Dormant account sudden reactivation"
                    checked={toggles.accountWarming}
                    onCheckedChange={(v) => updateToggle("accountWarming", v)}
                    activeBorder="border-amber-300"
                    activeBg="bg-amber-50"
                    activeText="text-amber-600"
                />
                <ToggleItem
                    label="English Entropy Mixer"
                    description="Suspicious mixed-language remark patterns"
                    checked={toggles.englishMixer}
                    onCheckedChange={(v) => updateToggle("englishMixer", v)}
                    activeBorder="border-rose-300"
                    activeBg="bg-rose-50"
                    activeText="text-rose-600"
                />
            </div>

            {/* Threat Level */}
            <div className="rounded-lg border-2 border-gray-100 bg-gray-50/50 px-3 py-1.5 flex items-center justify-between">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Threat Level</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`w-6 h-2 rounded-full transition-all duration-500 ${Object.values(toggles).filter(Boolean).length >= i
                                    ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-sm shadow-red-200"
                                    : "bg-gray-200"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
