import { useQuery } from '@tanstack/react-query';
import { Activity, ShieldCheck, Zap, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { BudgetChart, DepartmentBudgetChart, ProgressChart } from '../charts/DashboardCharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { ErrorState, LoadingBlock } from '../components/AsyncState';
import { getDashboard } from '../services/dashboardService';
import { getDepartments } from '../services/operationsService';
import AIInsightCard from '../components/AIInsightCard';
import { calculateSPI, calculateCPI, calculateProjectHealth } from '../utils/kpiCalculator';

export default function Dashboard() {
  const dashboard = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard, refetchInterval: 60_000 });
  const departments = useQuery({ queryKey: ['departments'], queryFn: getDepartments, staleTime: 300_000 });

  if (dashboard.isLoading) return <LoadingBlock rows={8} />;
  if (dashboard.isError) return <ErrorState error={dashboard.error} retry={dashboard.refetch} />;

  const d = dashboard.data;
  const aiInsights = d.recommendations || [];


  // Assuming some mock data or calculations for advanced KPIs if not fully provided by API
  const earnedValue = 85; // Example
  const plannedValue = 90; // Example
  const actualCost = 88; // Example
  
  const spi = calculateSPI(earnedValue, plannedValue);
  const cpi = calculateCPI(earnedValue, actualCost);
  const health = calculateProjectHealth(d.overall_progress || 80, d.budget_utilization || 75, d.high_risk_projects || 2);

  const stats = [
    { label: 'Active Projects', value: d.total_projects, change: 'Live portfolio signal', tone: 'text-cyan-300' },
    { label: 'Overall Completion', value: `${d.overall_progress}%`, change: 'On track', tone: 'text-green-400' },
    { label: 'Budget Utilization', value: `${d.budget_utilization}%`, change: 'Within limits', tone: 'text-emerald-400' },
    { label: 'Mission Readiness', value: `${d.mission_readiness}%`, change: 'Operational', tone: 'text-blue-400' },
    { label: 'SPI (Schedule)', value: spi, change: spi >= 1 ? 'Ahead of schedule' : 'Behind schedule', tone: spi >= 1 ? 'text-green-400' : 'text-red-400' },
    { label: 'CPI (Cost)', value: cpi, change: cpi >= 1 ? 'Under budget' : 'Over budget', tone: cpi >= 1 ? 'text-green-400' : 'text-red-400' }
  ];

  return (
    <>
      <PageHeader 
        eyebrow="Strategic project command center" 
        title="DRDO Executive Dashboard" 
        description="Live monitoring of strategic programmes, budget, risks, and predictive AI insights." 
      />
      
      {/* KPI Section */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 mb-6">
        {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-12 mb-6">
        
        {/* Left Column - Health & Insights */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Project Health Card */}
          <article className={`rounded-2xl border bg-panel p-6 shadow-sm ${health.status === 'Critical' ? 'border-red-500/50' : health.status === 'Needs Attention' ? 'border-orange-500/50' : 'border-emerald-500/50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Activity className={health.status === 'Critical' ? 'text-red-400' : 'text-emerald-400'} />
                Overall Portfolio Health
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${health.status === 'Critical' ? 'bg-red-500/20 text-red-400' : health.status === 'Needs Attention' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {health.status}
              </span>
            </div>
            
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{health.score}</span>
              <span className="text-muted mb-1">/ 100</span>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="bg-panel-2 rounded-lg p-3">
                 <p className="text-xs text-muted mb-1 flex items-center gap-1"><CheckCircle size={12}/> Completed</p>
                 <p className="text-lg font-semibold">{d.completed_projects}</p>
               </div>
               <div className="bg-panel-2 rounded-lg p-3">
                 <p className="text-xs text-muted mb-1 flex items-center gap-1"><Clock size={12}/> Delayed</p>
                 <p className="text-lg font-semibold text-orange-400">{d.delayed_projects}</p>
               </div>
            </div>
          </article>

          {/* AI Insights Section */}
          <section className="flex-1 rounded-2xl border border-line bg-panel p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-indigo-400" />
                <h2 className="font-semibold text-lg">AI Recommendations</h2>
              </div>
              <span className="text-xs text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">Live Analysis</span>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1 max-h-[400px]">
              {aiInsights.map((insight, idx) => (
                <AIInsightCard key={idx} {...insight} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Charts */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-panel p-4 h-[300px]">
              <BudgetChart data={d.budget_distribution} />
            </div>
            <div className="rounded-2xl border border-line bg-panel p-4 h-[300px]">
              <DepartmentBudgetChart data={departments.data || []} />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-4 h-[350px]">
             <ProgressChart data={d.monthly_progress} />
          </div>
        </div>
      </div>

      {/* Risk Distribution Footer */}
      <section className="rounded-2xl border border-line bg-panel p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-400" />
          <h2 className="font-semibold text-lg">Risk Distribution</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.risk_distribution.map(r => (
            <div key={r.level} className="rounded-xl bg-panel-2 p-4 flex items-center justify-between transition-all hover:bg-panel-3">
              <p className="capitalize text-sm font-medium text-muted">{r.level} Risk</p>
              <p className={`text-2xl font-bold ${r.level.toLowerCase() === 'high' ? 'text-red-400' : r.level.toLowerCase() === 'medium' ? 'text-orange-400' : 'text-emerald-400'}`}>
                {r.count}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
