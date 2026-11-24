import React from 'react';
import PageHeader from '../components/PageHeader';
import { History, User, Clock, FileEdit, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AuditLog() {
  const logs = [
    { id: 1, action: 'Budget Updated', details: 'Increased budget for Integrated Border Surveillance System by ₹5.5 Cr.', user: 'Dr. A. Sharma (Director)', time: '2026-07-20 10:15 AM', type: 'budget' },
    { id: 2, action: 'Risk Status Changed', details: 'Naval Surveillance System risk elevated to HIGH.', user: 'S. Patel (Project Manager)', time: '2026-07-19 04:30 PM', type: 'risk' },
    { id: 3, action: 'Milestone Completed', details: 'Secure Defence Communication: Hardware Validation marked complete.', user: 'K. Iyer (Lead Engineer)', time: '2026-07-19 11:00 AM', type: 'milestone' },
    { id: 4, action: 'Project Created', details: 'New project "Secure Military Cloud Infra" initialized.', user: 'System Admin', time: '2026-07-18 09:00 AM', type: 'system' },
    { id: 5, action: 'Settings Modified', details: 'Risk threshold updated from 70 to 75.', user: 'Dr. A. Sharma (Director)', time: '2026-07-17 02:20 PM', type: 'system' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'budget': return <FileEdit size={16} className="text-emerald-400" />;
      case 'risk': return <AlertTriangle size={16} className="text-orange-400" />;
      case 'milestone': return <ShieldCheck size={16} className="text-blue-400" />;
      default: return <History size={16} className="text-slate-400" />;
    }
  };

  return (
    <>
      <PageHeader 
        eyebrow="Security & Compliance" 
        title="System Audit Log" 
        description="Immutable record of system activities, configuration changes, and critical updates." 
      />

      <div className="mt-6 bg-panel border border-line rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-line bg-panel-2 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <History className="text-indigo-400" size={20} /> Activity Trail
          </h3>
          <button className="text-sm bg-panel border border-line text-slate-300 px-4 py-1.5 rounded-lg hover:bg-panel-3 transition-colors">
            Export Logs (CSV)
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="p-4 font-semibold text-muted text-sm">Action</th>
                <th className="p-4 font-semibold text-muted text-sm">Details</th>
                <th className="p-4 font-semibold text-muted text-sm">User</th>
                <th className="p-4 font-semibold text-muted text-sm">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-line hover:bg-panel-2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-panel-3 p-2 rounded-lg border border-line">
                        {getIcon(log.type)}
                      </div>
                      <span className="font-medium text-white">{log.action}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">{log.details || log.Engine}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <User size={14} className="text-muted" /> {log.user}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Clock size={14} className="text-muted" /> {log.time}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
