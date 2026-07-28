import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BrainCircuit } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import { ErrorState, LoadingBlock } from '../components/AsyncState';
import { getProject } from '../services/projectService';
import { getHealth, getPredictions, getRecommendations } from '../services/aiService';
import ProjectTimeline from '../components/projects/ProjectTimeline';
import MilestoneTracker from '../components/projects/MilestoneTracker';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const project = useQuery({ queryKey: ['project', projectId], queryFn: () => getProject(projectId) });
  const health = useQuery({ queryKey: ['health', projectId], queryFn: () => getHealth(projectId) });
  const prediction = useQuery({ queryKey: ['prediction', projectId], queryFn: () => getPredictions(projectId) });
  const recommendations = useQuery({ queryKey: ['recommendations', projectId], queryFn: () => getRecommendations(projectId) });

  if (project.isLoading) return <LoadingBlock />;
  if (project.isError) return <ErrorState error={project.error} retry={project.refetch} />;
  
  const p = project.data;

  // Process milestones for the tracker/timeline if the data doesn't perfectly match
  const processedMilestones = p.milestones?.map((m, idx) => ({
    id: m.milestone_id,
    title: m.title,
    date: m.deadline,
    status: m.completion_percentage === 100 ? 'completed' : m.completion_percentage > 0 ? 'in-progress' : idx === p.milestones.length - 1 ? 'upcoming' : 'delayed'
  })) || [];

  return (
    <>
      <PageHeader eyebrow="Project control record" title={p.project_name} description={p.description} />
      
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {[
          ['Progress', `${p.progress_percentage}%`],
          ['Budget', `₹${p.budget_used} / ₹${p.budget_allocated} Cr`],
          ['Health Score', health.data ? `${health.data.health_score}/100` : 'Loading…'],
          ['Predicted Completion', prediction.data?.estimated_completion_date || 'Loading…']
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs text-muted">{l}</p>
            <p className="mt-2 text-lg font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-12 mb-6">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <MilestoneTracker milestones={processedMilestones} />
          
          <section className="rounded-2xl border border-line bg-panel p-5">
            <h2 className="font-semibold text-lg mb-4">Milestone Breakdown</h2>
            <ProgressBar value={p.progress_percentage} className="mb-6" />
            <div className="grid gap-4 md:grid-cols-2">
              {p.milestones.map(m => (
                <div key={m.milestone_id} className="rounded-xl bg-panel-2 border border-line p-4">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="mt-1 text-xs text-muted">Deadline: {m.deadline} · {m.completion_percentage}% complete</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="xl:col-span-4 bg-panel border border-line rounded-2xl p-5">
          <h2 className="font-semibold text-lg mb-6">Project Timeline</h2>
          <ProjectTimeline milestones={processedMilestones} />
        </div>
      </div>

      <section className="mt-5 rounded-2xl border border-cyan-400/25 bg-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="text-cyan-300" size={18} />
          <h2 className="font-semibold text-lg">AI Decision Support</h2>
        </div>
        
        {recommendations.isLoading ? (
          <LoadingBlock rows={2} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.data?.recommendations?.map(r => (
              <article key={r.title} className="rounded-xl border border-line bg-panel-2 p-5 hover:bg-panel-3 transition-colors">
                <p className="text-xs font-medium text-cyan-300 mb-2">{r.priority} priority · {r.confidence_score}% confidence</p>
                <h3 className="font-semibold text-white">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-300">Reason: {r.reason}</p>
                <p className="mt-2 text-xs font-medium text-emerald-400">Impact: {r.expected_impact}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
