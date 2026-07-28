from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from ..config import get_settings
from ..database import get_db
from ..models.entities import *
from ..schemas.api import *
from ..services.ai_service import generate_recommendations
from ..services.prediction_service import predict
from ..utils.security import ALGORITHM, create_access_token, verify_password
from ..ai.project_analysis import analyze_project_health
from ..ai.budget_analysis import analyze_budget
from ..ai.risk_analysis import analyze_risks
from ..ai.prediction_service import predict_project
from ..ai.recommendation_service import build_summary, generate_recommendations
router=APIRouter(); oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/auth/login")
async def current_user(token:str=Depends(oauth2_scheme), db:AsyncSession=Depends(get_db))->User:
    try: email=jwt.decode(token,get_settings().secret_key,algorithms=[ALGORITHM]).get("sub")
    except JWTError: email=None
    user=await db.scalar(select(User).where(User.email==email)) if email else None
    if not user: raise HTTPException(status_code=401,detail="Invalid authentication credentials")
    return user
def role_guard(*roles:Role):
    async def guard(user:User=Depends(current_user))->User:
        if user.role not in roles: raise HTTPException(status_code=403,detail="Insufficient role permissions")
        return user
    return guard
async def project_ai_context(project_id:int, db:AsyncSession)->tuple[Project,dict,dict,dict,dict]:
    """Compose explainable decision-support signals for one project."""
    stmt=select(Project).options(selectinload(Project.tasks),selectinload(Project.milestones),selectinload(Project.risks)).where(Project.project_id==project_id)
    project=await db.scalar(stmt)
    if not project: raise HTTPException(404,"Project not found")
    delayed_tasks=sum(task.status==Status.DELAYED for task in project.tasks); delayed_milestones=sum(item.status==Status.DELAYED for item in project.milestones)
    health=analyze_project_health(project,len(project.tasks),delayed_tasks,len(project.milestones),delayed_milestones); budget=analyze_budget(project); risks=analyze_risks(project.project_id,project.risks); prediction=predict_project(project,health,budget,risks)
    return project,health,budget,risks,prediction
@router.post("/auth/login",response_model=Token,tags=["Authentication"])
async def login(payload:LoginRequest,db:AsyncSession=Depends(get_db)):
    user=await db.scalar(select(User).where(User.email==payload.email))
    if not user or not verify_password(payload.password,user.password_hash): raise HTTPException(status_code=401,detail="Invalid email or password")
    return Token(access_token=create_access_token(user.email,user.role.value))
@router.get("/dashboard",tags=["Dashboard"])
async def dashboard(_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    projects=(await db.scalars(select(Project))).all(); total=len(projects); allocated=sum(float(p.budget_allocated) for p in projects); used=sum(float(p.budget_used) for p in projects)
    formatted_recs = []
    if projects:
        _, health, budget, risks, prediction = await project_ai_context(projects[0].project_id, db)
        recs = generate_recommendations(health, budget, risks, prediction)
        formatted_recs = [{"title": r["title"], "text": r["reason"], "action": r["suggested_action"], "type": "AI Insight", "risk": r["priority"], "improvement": r["expected_impact"], "confidence": f"{r['confidence_score']}%"} for r in recs]
    return {"total_projects":total,"completed_projects":sum(p.status==Status.COMPLETED for p in projects),"delayed_projects":sum(p.status==Status.DELAYED for p in projects),"high_risk_projects":sum(p.risk_level in (RiskLevel.HIGH,RiskLevel.CRITICAL) for p in projects),"budget_utilization":round(used/allocated*100,1) if allocated else 0,"overall_progress":round(sum(p.progress_percentage for p in projects)/total,1) if total else 0,"mission_readiness":round(sum(p.progress_percentage-(10 if p.risk_level in (RiskLevel.HIGH,RiskLevel.CRITICAL) else 2) for p in projects)/total,1) if total else 0,"projects_on_schedule":sum(p.status==Status.ON_TRACK for p in projects),"budget_distribution":[{"project":p.project_name,"allocated":float(p.budget_allocated),"spent":float(p.budget_used)} for p in projects],"monthly_progress":[{"month":m,"progress":v} for m,v in zip(["Jan","Feb","Mar","Apr","May","Jun"],[41,47,53,58,63,68])],"risk_distribution":[{"level":level.value,"count":sum(p.risk_level==level for p in projects)} for level in RiskLevel], "recommendations": formatted_recs}
@router.get("/ai/project-health",tags=["AI Decision Support"])
async def ai_project_health(project_id:int=Query(...,description="Project identifier"),_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    _,health,_,_,_=await project_ai_context(project_id,db); return health
@router.get("/ai/budget-analysis",tags=["AI Decision Support"])
async def ai_budget_analysis(project_id:int=Query(...),_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    _,_,budget,_,_=await project_ai_context(project_id,db); return budget
@router.get("/ai/risk-analysis",tags=["AI Decision Support"])
async def ai_risk_analysis(project_id:int=Query(...),_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    _,_,_,risks,_=await project_ai_context(project_id,db); return risks
@router.get("/ai/predictions",tags=["AI Decision Support"])
async def ai_predictions(project_id:int=Query(...),_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    _,_,_,_,prediction=await project_ai_context(project_id,db); return prediction
@router.get("/ai/recommendations",tags=["AI Decision Support"])
async def ai_recommendations(project_id:int=Query(...),_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    project,health,budget,risks,prediction=await project_ai_context(project_id,db)
    return {"project_id":project.project_id,"project_name":project.project_name,"recommendations":generate_recommendations(health,budget,risks,prediction)}
@router.get("/ai/project-summary",tags=["AI Decision Support"])
async def ai_project_summary(project_id:int=Query(...),_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    _,health,budget,risks,prediction=await project_ai_context(project_id,db)
    return {"project_id":project_id,"summary":build_summary(health,budget,prediction,risks),"health_score":health["health_score"],"risk":risks["risk_level"],"delay_probability":f"{prediction['delay_probability']}%","predicted_completion":prediction["estimated_completion_date"],"recommendations":generate_recommendations(health,budget,risks,prediction)}
@router.get("/projects",response_model=ProjectPage,tags=["Projects"])
async def list_projects(page:int=Query(1,ge=1),page_size:int=Query(20,ge=1,le=100),search:str|None=None,status_filter:Status|None=Query(None,alias="status"),_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    stmt=select(Project); count=select(func.count()).select_from(Project)
    if search: stmt=stmt.where(Project.project_name.ilike(f"%{search}%")); count=count.where(Project.project_name.ilike(f"%{search}%"))
    if status_filter: stmt=stmt.where(Project.status==status_filter); count=count.where(Project.status==status_filter)
    total=await db.scalar(count) or 0; items=(await db.scalars(stmt.order_by(Project.updated_at.desc()).offset((page-1)*page_size).limit(page_size))).all(); return {"items":items,"total":total,"page":page,"page_size":page_size}
@router.get("/projects/{project_id}",response_model=ProjectDetails,tags=["Projects"])
async def get_project(project_id:int,_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    stmt=select(Project).options(selectinload(Project.milestones),selectinload(Project.tasks),selectinload(Project.budgets),selectinload(Project.risks),selectinload(Project.recommendations)).where(Project.project_id==project_id); project=await db.scalar(stmt)
    if not project: raise HTTPException(404,"Project not found")
    return {**ProjectOut.model_validate(project).model_dump(),"milestones":project.milestones,"tasks":project.tasks,"budgets":project.budgets,"risks":project.risks,"recommendations":project.recommendations,"prediction":predict(project)}
@router.post("/projects",response_model=ProjectOut,status_code=201,tags=["Projects"])
async def create_project(payload:ProjectCreate,db:AsyncSession=Depends(get_db),_:User=Depends(role_guard(Role.ADMIN,Role.PROJECT_MANAGER))):
    obj=Project(**payload.model_dump()); db.add(obj); await db.commit(); await db.refresh(obj); return obj
@router.put("/projects/{project_id}",response_model=ProjectOut,tags=["Projects"])
async def update_project(project_id:int,payload:ProjectUpdate,db:AsyncSession=Depends(get_db),_:User=Depends(role_guard(Role.ADMIN,Role.PROJECT_MANAGER))):
    obj=await db.get(Project,project_id)
    if not obj: raise HTTPException(404,"Project not found")
    for key,value in payload.model_dump(exclude_unset=True).items(): setattr(obj,key,value)
    await db.commit(); await db.refresh(obj); return obj
@router.delete("/projects/{project_id}",status_code=204,tags=["Projects"])
async def delete_project(project_id:int,db:AsyncSession=Depends(get_db),_:User=Depends(role_guard(Role.ADMIN))):
    obj=await db.get(Project,project_id)
    if not obj: raise HTTPException(404,"Project not found")
    await db.delete(obj); await db.commit()
@router.get("/departments",response_model=list[DepartmentOut],tags=["Operations"])
async def departments(_:User=Depends(current_user),db:AsyncSession=Depends(get_db)): return (await db.scalars(select(Department).order_by(Department.department_name))).all()
@router.get("/tasks",response_model=TaskPage,tags=["Operations"])
async def tasks(page:int=1,page_size:int=50,project_id:int|None=None,_:User=Depends(current_user),db:AsyncSession=Depends(get_db)):
    stmt=select(Task); count=select(func.count()).select_from(Task)
    if project_id: stmt=stmt.where(Task.project_id==project_id); count=count.where(Task.project_id==project_id)
    return {"items":(await db.scalars(stmt.offset((page-1)*page_size).limit(page_size))).all(),"total":await db.scalar(count),"page":page,"page_size":page_size}
@router.get("/milestones",response_model=list[MilestoneOut],tags=["Operations"])
async def milestones(_:User=Depends(current_user),db:AsyncSession=Depends(get_db)): return (await db.scalars(select(Milestone).order_by(Milestone.deadline))).all()
@router.get("/budget",response_model=list[BudgetOut],tags=["Operations"])
async def budget(_:User=Depends(current_user),db:AsyncSession=Depends(get_db)): return (await db.scalars(select(Budget))).all()
@router.get("/risks",response_model=list[RiskOut],tags=["Operations"])
async def risks(_:User=Depends(current_user),db:AsyncSession=Depends(get_db)): return (await db.scalars(select(Risk))).all()
@router.get("/reports/portfolio",tags=["Reports"])
async def report(_:User=Depends(current_user),db:AsyncSession=Depends(get_db)): return {"report_type":"portfolio_summary","generated_on":date.today(),"dashboard":await dashboard(_,db),"format":"json","pdf_export_ready":True}
