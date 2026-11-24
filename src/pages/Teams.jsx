import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import { ErrorState, LoadingBlock } from '../components/AsyncState';
import { getDepartments, getTasks } from '../services/operationsService';

export default function Teams() {
  const departments = useQuery({ queryKey: ['departments'], queryFn: getDepartments, staleTime: 300_000 });
  const tasks = useQuery({ queryKey: ['tasks'], queryFn: getTasks, staleTime: 60_000 });
  if (departments.isLoading || tasks.isLoading) return <LoadingBlock />;
  if (departments.isError || tasks.isError) return <ErrorState error={departments.error || tasks.error} retry={() => { departments.refetch(); tasks.refetch(); }} />;
  const activeTasks = tasks.data.items.filter(task => task.status !== 'completed');
  return <><PageHeader eyebrow="People & capacity" title="Teams" description="Department capacity and active workload from the programme database."/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{departments.data.map(department => { const assigned = activeTasks.filter(task => task.assigned_department === department.department_name); const load = Math.min(100, Math.round((assigned.length / Math.max(department.total_members, 1)) * 100 * 4)); return <article key={department.department_id} className="rounded-2xl border border-line bg-panel p-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Users size={19}/></div><h2 className="mt-4 font-semibold text-slate-100">{department.department_name}</h2><p className="mt-1 text-xs text-muted">Head: {department.department_head}</p><div className="mt-5 flex justify-between text-xs text-slate-300"><span>{department.total_members} personnel</span><span>{assigned.length} active tasks</span></div><div className="mt-4"><div className="mb-2 flex justify-between text-xs text-muted"><span>Workload indicator</span><span>{load}%</span></div><ProgressBar value={load}/></div></article>; })}</div></>;
}
