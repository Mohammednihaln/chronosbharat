import random
import uuid
from datetime import datetime, timezone


class ChronosEngine:
    """Mock fraud scoring engine for CHRONOS-BHARAT.

    Evaluates transaction risk based on the state of mule
    operation toggles, producing deterministic risk scores
    and human-readable explanations for each factor.
    """

    FACTOR_CONFIGS = {
        "geoSpoofing": {
            "name": "Geo Deviation",
            "base_score_range": (30, 40),
            "descriptions": [
                "Sender geo 400km from registered address",
                "IP geolocation mismatch with device GPS",
                "Cross-state transaction from dormant region",
            ],
        },
        "englishMixer": {
            "name": "Language Entropy",
            "base_score_range": (25, 35),
            "descriptions": [
                "Language entropy score 0.87 — mixed-script anomaly",
                "Remark pattern inconsistent with user history",
                "Unusual character distribution in transaction note",
            ],
        },
        "velocity": {
            "name": "Velocity Spike",
            "base_score_range": (15, 25),
            "descriptions": [
                "5 transactions in 120s — velocity spike detected",
                "Burst pattern exceeds 95th percentile threshold",
                "Micro-transaction clustering detected",
            ],
        },
        "accountWarming": {
            "name": "Account Age",
            "base_score_range": (10, 15),
            "descriptions": [
                "Dormant account reactivated 2h ago",
                "Account warming pattern — sudden activity surge",
                "Zero-balance account initiated high-value transfer",
            ],
        },
    }

    def evaluate(self, tx_data: dict) -> dict:
        """Score a transaction based on mule toggle states.

        Args:
            tx_data: Dict with keys: sender, receiver, amount, remark, toggles

        Returns:
            Scored transaction dict with risk_score, verdict, and factors.
        """
        toggles = tx_data.get("toggles", {})
        factors = []
        total_score = 0

        for toggle_key, config in self.FACTOR_CONFIGS.items():
            if toggles.get(toggle_key, False):
                score = random.randint(*config["base_score_range"])
                total_score += score
                factors.append({
                    "name": config["name"],
                    "score": score,
                    "description": random.choice(config["descriptions"]),
                })
            else:
                factors.append({
                    "name": config["name"],
                    "score": random.randint(1, 5),
                    "description": "Signal nominal",
                })

        # Clamp score
        risk_score = min(max(total_score, 0), 99)

        # If no toggles are active, force low score
        active_count = sum(1 for k in self.FACTOR_CONFIGS if toggles.get(k, False))
        if active_count == 0:
            risk_score = random.randint(10, 20)

        verdict = "BLOCKED" if risk_score >= 70 else ("SUSPICIOUS" if risk_score >= 40 else "SAFE")

        return {
            "tx_id": str(uuid.uuid4())[:8],
            "sender": tx_data.get("sender", "Unknown"),
            "receiver": tx_data.get("receiver", "Unknown"),
            "amount": tx_data.get("amount", 0),
            "remark": tx_data.get("remark", ""),
            "risk_score": risk_score,
            "verdict": verdict,
            "factors": factors,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
