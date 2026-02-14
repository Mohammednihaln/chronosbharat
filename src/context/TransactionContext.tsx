"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    ReactNode,
} from "react";

// Types
export interface MuleToggles {
    velocity: boolean;
    geoSpoofing: boolean;
    accountWarming: boolean;
    englishMixer: boolean;
}

export interface TransactionPayload {
    sender: string;
    receiver: string;
    amount: number;
    remark: string;
    toggles: MuleToggles;
}

export interface RiskFactor {
    name: string;
    score: number;
    description: string;
}

export interface ScoredTransaction {
    tx_id: string;
    sender: string;
    receiver: string;
    amount: number;
    remark: string;
    risk_score: number;
    verdict: "BLOCKED" | "SUSPICIOUS" | "SAFE";
    factors: RiskFactor[];
    timestamp: string;
}

export type FilterType = "all" | "blocked" | "suspicious" | "safe";

export interface SuspectedAccount {
    receiver: string;
    warnCount: number;
    lastRiskScore: number;
    lastTimestamp: string;
    senders: string[];
}

interface TransactionContextType {
    toggles: MuleToggles;
    setToggles: React.Dispatch<React.SetStateAction<MuleToggles>>;
    transactions: ScoredTransaction[];
    addTransaction: (tx: ScoredTransaction) => void;
    selectedTx: ScoredTransaction | null;
    setSelectedTx: (tx: ScoredTransaction | null) => void;
    totalTx: number;
    blockedTx: number;
    suspiciousTx: number;
    safeTx: number;
    sendTransaction: (payload: TransactionPayload) => void;
    lastResult: ScoredTransaction | null;
    wsConnected: boolean;
    // Warning modal state
    pendingTx: ScoredTransaction | null;
    confirmPending: () => void;
    cancelPending: () => void;
    // Filter state
    filterType: FilterType;
    setFilterType: (type: FilterType) => void;
    // Mule detection
    suspectedAccounts: SuspectedAccount[];
    confirmedMules: string[];
    isReceiverBlocked: (receiver: string) => boolean;
    // Blocked message for sender
    blockedMessage: string | null;
    clearBlockedMessage: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
    undefined
);

const RISK_THRESHOLD = 40; // Warning modal threshold
const MULE_TRACK_THRESHOLD = 60; // Track as suspected when risk > 60
const MULE_CONFIRM_COUNT = 3; // Confirm as mule after 3 warned payments

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [toggles, setToggles] = useState<MuleToggles>({
        velocity: false,
        geoSpoofing: false,
        accountWarming: false,
        englishMixer: false,
    });

    const [transactions, setTransactions] = useState<ScoredTransaction[]>([]);
    const [selectedTx, setSelectedTx] = useState<ScoredTransaction | null>(null);
    const [lastResult, setLastResult] = useState<ScoredTransaction | null>(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [pendingTx, setPendingTx] = useState<ScoredTransaction | null>(null);
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

    // Mule detection state
    const [suspectedMap, setSuspectedMap] = useState<
        Record<string, SuspectedAccount>
    >({});
    const [confirmedMules, setConfirmedMules] = useState<string[]>([]);

    const wsRef = useRef<WebSocket | null>(null);

    const isReceiverBlocked = useCallback(
        (receiver: string) => {
            return confirmedMules.includes(receiver);
        },
        [confirmedMules]
    );

    // WebSocket connection
    useEffect(() => {
        const connect = () => {
            // Use environment variable for WebSocket URL or fallback to localhost
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connected");
                setWsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const scored: ScoredTransaction = JSON.parse(event.data);

                    if (scored.risk_score >= RISK_THRESHOLD) {
                        setPendingTx(scored);
                    } else {
                        setTransactions((prev) => [scored, ...prev]);
                        setLastResult(scored);
                    }
                } catch (err) {
                    console.error("Failed to parse WS message:", err);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected, reconnecting in 2s...");
                setWsConnected(false);
                setTimeout(connect, 2000);
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
                ws.close();
            };

            wsRef.current = ws;
        };

        connect();

        return () => {
            wsRef.current?.close();
        };
    }, []);

    const addTransaction = useCallback((tx: ScoredTransaction) => {
        setTransactions((prev) => [tx, ...prev]);
        setLastResult(tx);
    }, []);

    const sendTransaction = useCallback(
        (payload: TransactionPayload) => {
            // Check if receiver is a confirmed mule
            if (confirmedMules.includes(payload.receiver)) {
                setBlockedMessage(
                    `🚫 This receiver "${payload.receiver}" has been identified as a Mule Account. You cannot send money to this account. This transaction has been automatically blocked.`
                );
                // Log as a blocked transaction locally
                const blockedTx: ScoredTransaction = {
                    tx_id: Math.random().toString(36).substring(2, 10),
                    sender: payload.sender,
                    receiver: payload.receiver,
                    amount: payload.amount,
                    remark: payload.remark,
                    risk_score: 100,
                    verdict: "BLOCKED",
                    factors: [
                        {
                            name: "Confirmed Mule Account",
                            score: 100,
                            description: "Receiver flagged as confirmed mule — auto-blocked",
                        },
                    ],
                    timestamp: new Date().toISOString(),
                };
                setTransactions((prev) => [blockedTx, ...prev]);
                setLastResult(blockedTx);
                return;
            }

            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(payload));
            } else {
                console.error("WebSocket not connected");
            }
        },
        [confirmedMules]
    );

    // User clicked "Proceed Anyway" — track receiver if risk > 60
    const confirmPending = useCallback(() => {
        if (!pendingTx) return;

        // Add to dashboard
        setTransactions((prev) => [pendingTx, ...prev]);
        setLastResult(pendingTx);

        // Track as suspected if risk > 60
        if (pendingTx.risk_score > MULE_TRACK_THRESHOLD) {
            const receiver = pendingTx.receiver;

            setSuspectedMap((prev) => {
                const existing = prev[receiver];
                const newCount = (existing?.warnCount || 0) + 1;
                const senders = existing?.senders || [];
                if (!senders.includes(pendingTx.sender)) {
                    senders.push(pendingTx.sender);
                }

                const updated = {
                    ...prev,
                    [receiver]: {
                        receiver,
                        warnCount: newCount,
                        lastRiskScore: pendingTx.risk_score,
                        lastTimestamp: pendingTx.timestamp,
                        senders: [...senders],
                    },
                };

                // Auto-confirm as mule if count reaches threshold
                if (newCount >= MULE_CONFIRM_COUNT) {
                    setConfirmedMules((prevMules) => {
                        if (!prevMules.includes(receiver)) {
                            return [...prevMules, receiver];
                        }
                        return prevMules;
                    });
                }

                return updated;
            });
        }

        setPendingTx(null);
    }, [pendingTx]);

    const cancelPending = useCallback(() => {
        setPendingTx(null);
    }, []);

    const clearBlockedMessage = useCallback(() => {
        setBlockedMessage(null);
    }, []);

    // Derived counts
    const suspectedAccounts = Object.values(suspectedMap).filter(
        (a) => !confirmedMules.includes(a.receiver)
    );

    const totalTx = transactions.length;
    const blockedTx = transactions.filter((t) => t.verdict === "BLOCKED").length;
    const suspiciousTx = transactions.filter(
        (t) => t.verdict === "SUSPICIOUS"
    ).length;
    const safeTx = transactions.filter((t) => t.verdict === "SAFE").length;

    return (
        <TransactionContext.Provider
            value={{
                toggles,
                setToggles,
                transactions,
                addTransaction,
                selectedTx,
                setSelectedTx,
                totalTx,
                blockedTx,
                suspiciousTx,
                safeTx,
                sendTransaction,
                lastResult,
                wsConnected,
                pendingTx,
                confirmPending,
                cancelPending,
                filterType,
                setFilterType,
                suspectedAccounts,
                confirmedMules,
                isReceiverBlocked,
                blockedMessage,
                clearBlockedMessage,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    const ctx = useContext(TransactionContext);
    if (!ctx)
        throw new Error("useTransaction must be used within TransactionProvider");
    return ctx;
}
