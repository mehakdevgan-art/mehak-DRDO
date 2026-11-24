import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ProjectTimeline({ milestones = [] }) {
  // Sample default data if none provided
  const data = milestones.length ? milestones : [
    { id: 1, title: 'Project Initiation', date: 'Jan 15, 2026', status: 'completed' },
    { id: 2, title: 'Requirements Finalized', date: 'Feb 28, 2026', status: 'completed' },
    { id: 3, title: 'Design Architecture', date: 'Apr 10, 2026', status: 'in-progress' },
    { id: 4, title: 'Prototype Development', date: 'Jul 20, 2026', status: 'delayed' },
    { id: 5, title: 'Testing & QA', date: 'Sep 05, 2026', status: 'upcoming' },
    { id: 6, title: 'Final Delivery', date: 'Nov 30, 2026', status: 'upcoming' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'delayed': return <AlertCircle className="w-5 h-5 text-orange-400" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-slate-500 bg-panel-2" />;
    }
  };

  const getLineColor = (status) => {
    if (status === 'completed') return 'bg-emerald-400/50';
    if (status === 'in-progress') return 'bg-blue-400/50';
    if (status === 'delayed') return 'bg-orange-400/50';
    return 'bg-line';
  };

  return (
    <div className="relative pl-4">
      {data.map((item, idx) => (
        <div key={item.id} className="relative flex items-start mb-8 last:mb-0 group">
          {/* Vertical Line */}
          {idx !== data.length - 1 && (
            <div className={`absolute top-6 left-[11px] w-0.5 h-[calc(100%+0.5rem)] ${getLineColor(item.status)}`} />
          )}
          
          {/* Node */}
          <div className="relative z-10 flex items-center justify-center bg-panel w-6 h-6 mt-0.5 shadow-sm">
            {getStatusIcon(item.status)}
          </div>
          
          {/* Content */}
          <div className="ml-6 flex-1 bg-panel border border-line rounded-lg p-3 hover:bg-panel-2 transition-colors cursor-pointer">
            <h4 className="font-medium text-slate-200">{item.title}</h4>
            <div className="flex gap-3 mt-1 text-xs">
              <span className="text-muted">{item.date}</span>
              <span className={`capitalize font-medium ${item.status === 'completed' ? 'text-emerald-400' : item.status === 'in-progress' ? 'text-blue-400' : item.status === 'delayed' ? 'text-orange-400' : 'text-slate-500'}`}>
                {item.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
