import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const mobileLinks = [['/dashboard', 'Dashboard'], ['/projects', 'Projects'], ['/departments', 'Departments'], ['/milestones', 'Milestones'], ['/budget', 'Budget'], ['/ai-insights', 'AI Risk'], ['/reports', 'Reports']];

export default function AppLayout() { return <div className="min-h-screen bg-ink"><Sidebar /><div className="lg:pl-64"><Topbar /><nav className="scrollbar-hide flex gap-1 overflow-x-auto border-b border-line px-4 py-2 lg:hidden">{mobileLinks.map(([to, label]) => <NavLink key={to} to={to} className={({isActive}) => `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${isActive ? 'bg-brand/15 text-brand-soft' : 'text-muted'}`}>{label}</NavLink>)}</nav><main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><Outlet /></main></div></div>; }
