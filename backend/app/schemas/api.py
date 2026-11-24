from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from ..models.entities import RiskLevel, Role, Status
class ORM(BaseModel): model_config=ConfigDict(from_attributes=True)
class Token(BaseModel): access_token: str; token_type: str="bearer"
class LoginRequest(BaseModel):
    # The seeded institutional account deliberately uses a .local domain.
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=128)
class UserOut(ORM): id:int; email:EmailStr; full_name:str; role:Role
class ProjectBase(BaseModel): project_name:str=Field(min_length=3,max_length=180); description:str; start_date:date; expected_end_date:date; actual_end_date:date|None=None; status:Status=Status.PLANNED; progress_percentage:float=Field(default=0,ge=0,le=100); priority:str; budget_allocated:float=Field(gt=0); budget_used:float=Field(default=0,ge=0); budget_remaining:float=Field(ge=0); risk_level:RiskLevel=RiskLevel.LOW; predicted_completion_date:date|None=None
class ProjectCreate(ProjectBase): pass
class ProjectUpdate(BaseModel): project_name:str|None=None; description:str|None=None; status:Status|None=None; progress_percentage:float|None=Field(default=None,ge=0,le=100); priority:str|None=None; budget_used:float|None=Field(default=None,ge=0); budget_remaining:float|None=Field(default=None,ge=0); risk_level:RiskLevel|None=None; expected_end_date:date|None=None; predicted_completion_date:date|None=None
class ProjectOut(ProjectBase,ORM): project_id:int; created_at:datetime; updated_at:datetime
class MilestoneOut(ORM): milestone_id:int; project_id:int; title:str; deadline:date; status:Status; completion_percentage:float
class TaskOut(ORM): task_id:int; project_id:int; assigned_department:str; assigned_member:str|None; title:str; description:str; status:Status; priority:str; planned_start:date; planned_end:date; actual_end:date|None; completion_percentage:float
class BudgetOut(ORM): budget_id:int; project_id:int; allocated:float; spent:float; remaining:float; financial_year:str
class RiskOut(ORM): risk_id:int; project_id:int; risk_title:str; severity:RiskLevel; probability:float; impact:float; mitigation_plan:str; status:Status
class RecommendationOut(ORM): recommendation_id:int; project_id:int; recommendation:str; reason:str; confidence_score:float; expected_improvement:str; generated_at:datetime
class ProjectDetails(ProjectOut): milestones:list[MilestoneOut]=[]; tasks:list[TaskOut]=[]; budgets:list[BudgetOut]=[]; risks:list[RiskOut]=[]; recommendations:list[RecommendationOut]=[]; prediction:dict={}
class DepartmentOut(ORM): department_id:int; department_name:str; department_head:str; total_members:int
class ProjectPage(BaseModel):
    items: list[ProjectOut]
    total: int
    page: int
    page_size: int
class TaskPage(BaseModel):
    items: list[TaskOut]
    total: int
    page: int
    page_size: int
