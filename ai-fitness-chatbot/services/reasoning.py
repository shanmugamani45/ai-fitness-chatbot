def decide_intent(message: str):
    msg = message.lower()

    if "diet" in msg or "meal" in msg or "food" in msg:
        return "diet"
    if "recovery" in msg or "rest" in msg:
        return "recovery"
    if "injury" in msg or "pain" in msg:
        return "injury"

    return "unknown"


def extract_diet_request(message: str):
    msg = message.lower()

    # CATEGORY
    if "muscle" in msg:
        category = "muscle_gain"
    elif "cut" in msg or "cutting" in msg or "fat loss" in msg:
        category = "cutting"
    elif "bulk" in msg or "bulking" in msg:
        category = "bulking"
    else:
        return None, None

    # LEVEL (ONLY FOR MUSCLE GAIN)
    if category == "muscle_gain":
        if "advanced" in msg:
            level = "advanced"
        elif "intermediate" in msg:
            level = "intermediate"
        else:
            level = "beginner"
    else:
        level = None   # IMPORTANT FIX

    return category, level
