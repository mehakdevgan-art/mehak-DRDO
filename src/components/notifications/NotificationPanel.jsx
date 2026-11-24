import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function NotificationPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    { id: 1, type: 'critical', title: 'Budget Exceeded', message: 'Project Alpha exceeded budget by 12%.', time: '10m ago' },
    { id: 2, type: 'warning', title: 'Critical Milestone Delayed', message: 'Integration Phase for Naval Radar is delayed by 5 days.', time: '1h ago' },
    { id: 3, type: 'success', title: 'Project Completed Successfully', message: 'Aeronautics Engine V2 passed final review.', time: '2h ago' },
    { id: 4, type: 'info', title: 'Resource Overallocation', message: 'Team Delta is at 110% capacity.', time: '3h ago' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed right-0 top-0 bottom-0 z-50 w-80 sm:w-96 bg-panel border-l border-line shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b border-line flex justify-between items-center bg-panel">
          <h2 className="text-lg font-semibold flex items-center gap-2">Notifications <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">{notifications.length}</span></h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {notifications.map(n => (
            <div key={n.id} className="p-3 rounded-lg border border-line bg-panel-2 hover:bg-panel-3 transition-colors cursor-pointer flex gap-3">
              <div className="mt-0.5">{getIcon(n.type)}</div>
              <div>
                <h4 className="text-sm font-medium text-white">{n.title}</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-muted mt-2 block">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-line text-center bg-panel">
          <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">View All Alerts</button>
        </div>
      </div>
    </>
  );
}
