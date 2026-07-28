import React from 'react';
import { Flag, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function MilestoneTracker({ milestones = [] }) {
  const summary = {
    completed: milestones.filter(m => m.status === 'completed').length || 3,
    inProgress: milestones.filter(m => m.status === 'in-progress').length || 2,
    delayed: milestones.filter(m => m.status === 'delayed').length || 1,
    upcoming: milestones.filter(m => m.status === 'upcoming').length || 4,
  };

  const total = summary.completed + summary.inProgress + summary.delayed + summary.upcoming;

  return (
    <div className="bg-panel border border-line rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-6">
        <Flag className="text-indigo-400" size={20} />
        <h3 className="font-semibold text-lg text-white">Milestone Tracking</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle className="text-emerald-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{summary.completed}</span>
          <span className="text-xs text-emerald-400 font-medium">Completed</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Clock className="text-blue-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{summary.inProgress}</span>
          <span className="text-xs text-blue-400 font-medium">In Progress</span>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="text-orange-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{summary.delayed}</span>
          <span className="text-xs text-orange-400 font-medium">Delayed</span>
        </div>
        <div className="bg-panel-2 border border-line rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <Flag className="text-slate-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{summary.upcoming}</span>
          <span className="text-xs text-slate-400 font-medium">Upcoming</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((summary.completed / total) * 100)}%</span>
        </div>
        <div className="w-full bg-panel-2 rounded-full h-2 flex overflow-hidden">
          <div style={{ width: `${(summary.completed / total) * 100}%` }} className="bg-emerald-400 h-full" />
          <div style={{ width: `${(summary.inProgress / total) * 100}%` }} className="bg-blue-400 h-full opacity-70" />
          <div style={{ width: `${(summary.delayed / total) * 100}%` }} className="bg-orange-400 h-full" />
        </div>
      </div>
    </div>
  );
}
