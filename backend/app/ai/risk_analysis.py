from ..models.entities import Risk, RiskLevel
def analyze_risks(project_id: int, risks: list[Risk]) -> dict:
    weights={RiskLevel.LOW:20,RiskLevel.MEDIUM:50,RiskLevel.HIGH:75,RiskLevel.CRITICAL:95}
    contributions=[weights[r.severity]*r.probability*r.impact for r in risks]
    score=round(min(100,sum(contributions)/max(len(contributions),1)),1)
    level="High" if score>=65 else "Medium" if score>=35 else "Low"
    reasons=[f"{risk.risk_title} ({risk.severity.value} severity)" for risk in risks if risk.severity in (RiskLevel.HIGH,RiskLevel.CRITICAL)]
    if not reasons: reasons=["No high-severity open risk is recorded."]
    return {"project_id":project_id,"overall_risk_score":score,"risk_level":level,"high_risk_count":sum(r.severity in (RiskLevel.HIGH,RiskLevel.CRITICAL) for r in risks),"reasons":reasons,"risks":[{"title":r.risk_title,"severity":r.severity.value,"probability":round(r.probability*100,1),"impact":round(r.impact*100,1),"mitigation_plan":r.mitigation_plan} for r in risks]}
