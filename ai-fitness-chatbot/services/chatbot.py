import json
from pathlib import Path

# -----------------------------
# PATH SETUP (SAFE)
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge"


def load_json(filename: str, default):
    path = KNOWLEDGE_DIR / filename

    if not path.exists():
        return default

    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


diet_data = load_json("diet.json", {})
recovery_data = load_json("recovery.json", {})
injury_data = load_json("injuries.json", {})

# -----------------------------
# OLD LOGIC (DO NOT TOUCH)
# -----------------------------
def decide_intent(message: str):
    msg = message.lower()

    if "diet" in msg or "meal" in msg or "food" in msg:
        return "diet"

    if "recovery" in msg or "rest" in msg:
        return "recovery"

    if "injury" in msg or "pain" in msg:
        return "injury"

    return "unknown"


# -----------------------------
# DIET REASONING
# -----------------------------
def extract_diet_request(message: str):
    msg = message.lower()

    if "muscle" in msg:
        category = "muscle_gain"
    elif "cut" in msg:
        category = "cutting"
    elif "bulk" in msg:
        category = "bulking"
    else:
        return None, None

    if "advanced" in msg:
        level = "advanced"
    elif "intermediate" in msg:
        level = "intermediate"
    else:
        level = "beginner"

    return category, level


# -----------------------------
# RECOVERY REASONING
# -----------------------------

def extract_recovery_context(message: str):
    msg = message.lower()

    if "leg" in msg or "squat" in msg:
        return "legs"
    if "chest" in msg or "bench" in msg:
        return "chest"
    if "back" in msg or "deadlift" in msg:
        return "back"
    if "shoulder" in msg:
        return "shoulders"
    if "rest day" in msg:
        return "rest_day"
    if "sore" in msg or "doms" in msg:
        return "doms"

    return "general"


# -----------------------------
#INJURY REASONING
# -----------------------------

def detect_pain_severity(message: str):
    msg = message.lower()

    if any(word in msg for word in ["sharp", "swelling", "cannot move", "severe", "tear"]):
        return "severe"

    if any(word in msg for word in ["pain", "hurts", "aching", "hard to move"]):
        return "moderate"

    if any(word in msg for word in ["sore", "soreness", "tight"]):
        return "mild"

    return "unknown"




# -----------------------------
# PUBLIC API (STABLE)
# -----------------------------
def chatbot_response(message: str):
    intent = decide_intent(message)

    if intent == "diet":
        category, level = extract_diet_request(message)

        if not category:
            return {"reply": "Please specify muscle gain, cutting, or bulking."}

        if category == "muscle_gain":
            plan = diet_data["muscle_gain"].get(level)
            if not plan:
                return {"reply": "Diet plan not found."}

            text = "\n".join(plan["plan"])
            return {"reply": f"{level.title()} Muscle Gain Diet:\n{text}"}

        plan = diet_data.get(category, {}).get("plan")
        if not plan:
            return {"reply": "Diet plan not found."}

        return {"reply": f"{category.title()} Diet:\n" + "\n".join(plan)}


    if intent == "recovery":
        key = extract_recovery_context(message)

        plan = recovery_data.get(key, recovery_data["general"]).get("plan")

        return {
            "reply": f"Recovery Advice ({key.replace('_',' ').title()}):\n"
                    + "\n".join(plan)
        }

    
    if intent == "injury":
        severity = detect_pain_severity(message)

        if severity == "mild":
            return {
                "reply": (
                    "Mild Injury Advice:\n"
                    "• Reduce training intensity\n"
                    "• Ice 15–20 minutes\n"
                    "• Light mobility work\n"
                    "• Monitor for 48 hours"
                )
            }

        if severity == "moderate":
            return {
                "reply": (
                    "Moderate Injury Advice:\n"
                    "• Stop training the affected area\n"
                    "• Ice + compression\n"
                    "• Gentle range-of-motion only\n"
                    "• Rest 3–5 days"
                )
            }

        if severity == "severe":
            return {
                "reply": (
                    "Severe Injury Warning:\n"
                    "• Stop all training immediately\n"
                    "• Do NOT stretch or load\n"
                    "• Seek medical professional\n"
                    "• Possible tear or inflammation"
                )
            }

        return {"reply": "Describe pain level clearly (mild / severe / sharp)."}


    return {"reply": "Ask me about diet, recovery, or injuries."}
