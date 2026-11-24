from datetime import timedelta
from ..models.entities import Project
def predict(project:Project)->dict:
    """Deterministic placeholder; replace with an ML provider behind this boundary."""
    elapsed=max((project.expected_end_date-project.start_date).days,1); expected=min(100,((__import__('datetime').date.today()-project.start_date).days/elapsed)*100); delay=max(0,expected-project.progress_percentage); budget_ratio=float(project.budget_used)/max(float(project.budget_allocated),1)
    return {"estimated_completion_date":str(project.expected_end_date+timedelta(days=round(delay*.8))),"delay_probability":round(min(95,delay*1.8),1),"budget_overrun_probability":round(min(95,max(0,budget_ratio-.74)*100),1),"mission_readiness_score":round(max(0,min(100,project.progress_percentage-(10 if project.risk_level.value in ('high','critical') else 2))),1)}
