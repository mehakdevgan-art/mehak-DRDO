from ..models.entities import Project, RiskLevel
def generate_recommendations(project:Project)->list[dict]:
    """Rule engine facade designed to be replaced by an LLM/RAG adapter."""
    items=[]; ratio=float(project.budget_used)/max(float(project.budget_allocated),1)
    if ratio>.9: items.append({"recommendation":"Initiate financial review.","reason":"Budget usage exceeds 90% of allocation.","confidence_score":92,"expected_improvement":"Controls prevent further unapproved variance."})
    if project.progress_percentage<50: items.append({"recommendation":"Increase engineering manpower.","reason":"Progress remains below the expected delivery trajectory.","confidence_score":86,"expected_improvement":"Expected recovery of 10 delivery days."})
    if project.risk_level in (RiskLevel.HIGH,RiskLevel.CRITICAL): items.append({"recommendation":"Escalate mitigation actions immediately.","reason":"High project risk requires command-level ownership.","confidence_score":94,"expected_improvement":"Reduces the likelihood of critical path slippage."})
    return items or [{"recommendation":"Maintain current execution controls.","reason":"Current financial, schedule, and risk indicators are within tolerance.","confidence_score":80,"expected_improvement":"Preserves approved delivery baseline."}]
