import hashlib
import json
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
                "IP geolocation mismatch with device GPS profile",
                "Cross-border login detected within <5m of transaction",
                "Impossible travel velocity: >800km/h between logins",
            ],
        },
        "englishMixer": {
            "name": "Language Entropy",
            "base_score_range": (25, 35),
            "descriptions": [
                "High entropy in payment remark (score: 0.87)",
                "Unusual character distribution — potential code injection",
                "Mixed-script anomaly detected in beneficiary name",
            ],
        },
        "velocity": {
            "name": "Velocity Spike",
            "base_score_range": (15, 25),
            "descriptions": [
                "Velocity spike: 5+ transactions in <120s window",
                "Burst pattern exceeds historical 95th percentile",
                "Rapid fund dispersion to multiple new beneficiaries",
            ],
        },
        "accountWarming": {
            "name": "Account Age",
            "base_score_range": (10, 15),
            "descriptions": [
                "Sudden high-value transfer from dormant account",
                "Account warming pattern detected (low value -> high value)",
                "Zero-balance account initiated rapid pass-through",
            ],
        },
    }

    def _get_deterministic_int(self, seed: str, min_val: int, max_val: int) -> int:
        """Returns a stable integer between min_val and max_val based on seed."""
        hash_obj = hashlib.sha256(seed.encode())
        hash_int = int(hash_obj.hexdigest(), 16)
        range_size = max_val - min_val + 1
        return min_val + (hash_int % range_size)

    def _get_deterministic_choice(self, seed: str, choices: list):
        """Returns a stable choice from a list based on seed."""
        idx = self._get_deterministic_int(seed, 0, len(choices) - 1)
        return choices[idx]

    def evaluate(self, tx_data: dict) -> dict:
        """Score a transaction deterministically based on input data."""
        toggles = tx_data.get("toggles", {})
        factors = []
        total_score = 0
        
        # Create a unique seed for this transaction context
        # We use sender+receiver as base so same pair gets similar results,
        # but add toggles so changing toggles changes the outcome.
        toggle_str = "".join(sorted([k for k, v in toggles.items() if v]))
        base_seed = f"{tx_data.get('sender', '')}-{tx_data.get('receiver', '')}-{toggle_str}"

        for toggle_key, config in self.FACTOR_CONFIGS.items():
            factor_seed = f"{base_seed}-{toggle_key}"
            
            if toggles.get(toggle_key, False):
                score = self._get_deterministic_int(
                    factor_seed, 
                    *config["base_score_range"]
                )
                total_score += score
                
                description = self._get_deterministic_choice(
                    factor_seed, 
                    config["descriptions"]
                )
                
                factors.append({
                    "name": config["name"],
                    "score": score,
                    "description": description,
                })
            else:
                # Add a small nominal noise score for realism, but keep it low
                nominal_score = self._get_deterministic_int(factor_seed, 0, 5)
                # Only add to total if it's significant, otherwise ignore for cleaner UX
                if nominal_score > 3:
                    total_score += nominal_score
                    factors.append({
                        "name": config["name"],
                        "score": nominal_score,
                        "description": "Signal nominal within varying bounds",
                    })

        # Clamp score
        risk_score = min(max(total_score, 0), 99)

        # Build Verdict
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
