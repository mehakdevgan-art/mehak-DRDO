from datetime import date
from ..models.entities import Project, Status
def analyze_project_health(project: Project, task_count: int = 0, delayed_tasks: int = 0, milestone_count: int = 0, delayed_milestones: int = 0) -> dict:
    """Score execution health without an external model; all factors are explainable."""
    duration = max((project.expected_end_date - project.start_date).days, 1)
    expected_progress = min(100, max(0, (date.today() - project.start_date).days / duration * 100))
    schedule_gap = max(0, expected_progress - project.progress_percentage)
    task_penalty = (delayed_tasks / max(task_count, 1)) * 15
    milestone_penalty = (delayed_milestones / max(milestone_count, 1)) * 15
    budget_ratio = float(project.budget_used) / max(float(project.budget_allocated), 1)
    score = round(max(0, min(100, 100 - schedule_gap * .55 - task_penalty - milestone_penalty - max(0, budget_ratio - .85) * 45)))
    label = "Healthy" if score >= 80 else "Watch" if score >= 60 else "Critical"
    schedule = "On Schedule" if schedule_gap < 8 else "Slight Delay" if schedule_gap < 18 else "High Delay Risk"
    return {"project_id": project.project_id, "project_name": project.project_name, "health_score": score, "health_status": label, "schedule_status": schedule, "actual_progress": round(project.progress_percentage, 1), "expected_progress": round(expected_progress, 1), "progress_gap": round(schedule_gap, 1), "delayed_tasks": delayed_tasks, "delayed_milestones": delayed_milestones}
