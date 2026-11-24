import { BarChart3, BrainCircuit, CircleDollarSign, FileBarChart, Flag, FolderKanban, LayoutDashboard, ShieldAlert, UsersRound, Settings, GitCompare, Activity, History } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, 
  { to: '/projects', label: 'Projects', icon: FolderKanban }, 
  { to: '/compare', label: 'Comparison', icon: GitCompare },
  { to: '/departments', label: 'Departments', icon: UsersRound }, 
  { to: '/resources', label: 'Resources', icon: Activity },
  { to: '/milestones', label: 'Milestones', icon: Flag }, 
  { to: '/budget', label: 'Budget', icon: CircleDollarSign }, 
  { to: '/risks', label: 'Risk Assessment', icon: ShieldAlert }, 
  { to: '/ai-insights', label: 'Decision Support', icon: BrainCircuit }, 
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/audit-log', label: 'Audit Log', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar() { 
  return (
    <aside className="hidden fixed inset-y-0 left-0 z-20 w-64 border-r border-line bg-[#0d131f] lg:flex lg:flex-col overflow-y-auto scrollbar-hide">
      <div className="flex flex-col h-24 justify-center gap-1 px-6 shrink-0 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
            <BarChart3 size={19} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">DPM-DSS</span>
        </div>
        <span className="text-[10px] text-muted leading-tight mt-1 hidden lg:block">Intelligent Monitoring & Decision Support</span>
      </div>
      
      <nav className="mt-4 flex-1 space-y-1 px-3 pb-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      
      <div className="m-4 rounded-xl border border-line bg-panel p-4 shrink-0">
        <p className="text-xs font-medium text-cyan-300">Secure portfolio view</p>
        <p className="mt-1 text-xs leading-5 text-muted">Data synchronized 08:45 IST.</p>
      </div>
    </aside>
  ); 
}
