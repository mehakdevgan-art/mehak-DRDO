from datetime import date, timedelta
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from .models.entities import *
from .utils.security import hash_password, verify_password
async def seed_database(db:AsyncSession)->None:
    """Create deterministic data once and repair the demo administrator if needed."""
    admin = await db.scalar(select(User).where(User.email == "admin@drdo.local"))
    if not admin:
        db.add(User(email="admin@drdo.local",full_name="System Administrator",password_hash=hash_password("Admin@123"),role=Role.ADMIN))
        await db.flush()
    elif not verify_password("Admin@123", admin.password_hash):
        admin.password_hash = hash_password("Admin@123")
        admin.role = Role.ADMIN
        await db.commit()
    if await db.scalar(select(func.count()).select_from(Project)): return
    departments=["Advanced Research","Communication Systems","Radar Systems","Cyber Security","Testing & Validation","Field Deployment","Electronics","Aerospace Research","Data Engineering","Procurement","Systems Integration","Quality Assurance"]
    for i,name in enumerate(departments): db.add(Department(department_name=name,department_head=f"Dr. {['Mehta','Rao','Singh','Iyer'][i%4]}",total_members=8+i%9))
    names=["Radar Modernization","Communication Upgrade","Border Surveillance System","Autonomous UAV Platform","Electronic Warfare Suite","Secure Command Network","Integrated Sensor Grid","Tactical Data Link","Counter Drone System","Satellite Ground Terminal","Naval Surveillance Suite","Secure Mesh Network","Mission Planning System","Cognitive Radar Array"]
    today=date.today()
    for i,name in enumerate(names):
        risk=[RiskLevel.LOW,RiskLevel.MEDIUM,RiskLevel.HIGH][i%3]; status=[Status.ON_TRACK,Status.ON_TRACK,Status.AT_RISK,Status.DELAYED][i%4]; allocated=12+i*2.7; used=allocated*(.5+(i%4)*.1)
        p=Project(project_name=name,description=f"Strategic defence programme for {name.lower()}.",start_date=today-timedelta(days=180+i*8),expected_end_date=today+timedelta(days=120+i*20),status=status,progress_percentage=42+(i*3)%45,priority="critical" if i<4 else "high",budget_allocated=allocated,budget_used=used,budget_remaining=allocated-used,risk_level=risk,predicted_completion_date=today+timedelta(days=125+i*20)); db.add(p); await db.flush()
        db.add(Budget(project_id=p.project_id,allocated=allocated,spent=used,remaining=allocated-used,financial_year="2026-27"))
        for j in range(3): db.add(Milestone(project_id=p.project_id,title=f"{name} validation gate {j+1}",deadline=today+timedelta(days=30+j*35+i),status=status,completion_percentage=min(100,p.progress_percentage+j*8)))
        for j in range(9 if i==0 else 7): db.add(Task(project_id=p.project_id,assigned_department=departments[(i+j)%12],assigned_member=None,title=f"{name} work package {j+1}",description="Controlled programme work package.",status=status,priority="high",planned_start=today-timedelta(days=30),planned_end=today+timedelta(days=20+j*5),actual_end=None,completion_percentage=max(0,min(100,p.progress_percentage-j*4))))
        for j in range(3 if i<2 else 2): db.add(Risk(project_id=p.project_id,risk_title=f"{name} delivery dependency {j+1}",severity=risk,probability=.3+j*.1,impact=.6+j*.1,mitigation_plan="Conduct weekly command review and dependency tracking.",status=status))
    await db.commit()
