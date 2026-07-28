from datetime import date, timedelta
from ..models.entities import Project, RiskLevel
def predict_project(project: Project, health: dict, budget: dict, risk: dict) -> dict:
    gap=health["progress_gap"]; risk_factor={RiskLevel.LOW:0,RiskLevel.MEDIUM:5,RiskLevel.HIGH:12,RiskLevel.CRITICAL:20}[project.risk_level]
    delay_probability=round(min(95, gap*2+risk_factor+risk["overall_risk_score"]*.2),1)
    completion=project.expected_end_date+timedelta(days=round(gap*.8+delay_probability*.1))
    readiness=round(max(0,min(100,health["health_score"]*.55+project.progress_percentage*.25+(100-risk["overall_risk_score"])*.2)),1)
    confidence=round(max(55,min(96,92-gap*.45-risk["overall_risk_score"]*.12)),1)
    return {"project_id":project.project_id,"estimated_completion_date":completion.isoformat(),"delay_probability":delay_probability,"budget_overrun_probability":budget["budget_overrun_probability"],"mission_readiness_score":readiness,"forecast_confidence":confidence}
