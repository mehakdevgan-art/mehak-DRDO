import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import NotificationPanel from '../components/notifications/NotificationPanel';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../services/authService';

export default function Topbar() { 
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = () => { clearToken(); navigate('/login', { replace: true }); };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-ink/90 px-4 backdrop-blur sm:px-6 lg:px-8">
        <button className="rounded-lg p-2 text-slate-400 lg:hidden" aria-label="Open navigation">
          <Menu size={20}/>
        </button>
        <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 md:flex">
          <Search size={16} className="text-muted"/>
          <input className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600" placeholder="Search projects, divisions..." />
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          
          {/* Simulated Role Selector */}
          <div className="hidden md:flex items-center gap-2 bg-panel-2 border border-line rounded-lg px-2 py-1.5">
            <span className="text-xs text-muted font-medium">Role:</span>
            <select className="bg-transparent border-none outline-none text-xs font-semibold text-cyan-300 cursor-pointer">
              <option>Administrator</option>
              <option>Project Director</option>
              <option>Senior Scientist</option>
              <option>Project Manager</option>
              <option>Finance Officer</option>
              <option>Department Head</option>
              <option>Quality Assurance</option>
              <option>Viewer</option>
            </select>
          </div>

          <button 
            onClick={() => navigate('/alerts')}
            className="hidden items-center gap-2 rounded-lg bg-red-400/10 px-3 py-2 text-xs font-medium text-red-400 sm:flex hover:bg-red-400/20 transition-colors"
          >
            <Bell size={15}/> Smart Alerts
          </button>
          
          <div className="h-6 w-px bg-line hidden sm:block"></div>
          
          <button 
            className="relative rounded-lg p-2 text-slate-400 hover:bg-panel hover:text-white transition-colors"
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell size={19}/>
            <i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
          </button>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">PD</div>
          <button onClick={logout} title="Sign out" className="rounded-lg p-2 text-slate-400 hover:bg-panel hover:text-rose-300"><LogOut size={18}/></button>
        </div>
      </header>
      
      <NotificationPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </>
  ); 
}
