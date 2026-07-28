from ..models.entities import Project
def analyze_budget(project: Project) -> dict:
    allocated, used = float(project.budget_allocated), float(project.budget_used)
    ratio = used / max(allocated, 1); remaining = max(0, allocated - used)
    if ratio >= .9: assessment, risk = "Overspending risk", "High"
    elif ratio < .45 and project.progress_percentage > 60: assessment, risk = "Underspending review required", "Medium"
    else: assessment, risk = "Within planned controls", "Low"
    overrun_probability = round(min(95, max(0, (ratio - .72) * 145 + (100 - project.progress_percentage) * .12)), 1)
    return {"project_id":project.project_id,"project_name":project.project_name,"budget_allocated":allocated,"budget_used":used,"budget_remaining":remaining,"budget_utilization_percent":round(ratio*100,1),"assessment":assessment,"overrun_risk":risk,"budget_overrun_probability":overrun_probability}
