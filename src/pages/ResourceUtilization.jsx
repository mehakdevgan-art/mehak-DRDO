import React from 'react';
import PageHeader from '../components/PageHeader';
import { Users, Battery, BatteryCharging, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ResourceUtilization() {
  const departments = [
    { id: 1, name: 'Aeronautics', capacity: 150, workload: 145, status: 'High' },
    { id: 2, name: 'Naval Systems', capacity: 120, workload: 85, status: 'Optimal' },
    { id: 3, name: 'Armaments', capacity: 200, workload: 210, status: 'Overloaded' },
    { id: 4, name: 'Missile Defense', capacity: 180, workload: 160, status: 'High' },
    { id: 5, name: 'R&D', capacity: 80, workload: 40, status: 'Underutilized' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Optimal': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'High': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Overloaded': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Underutilized': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Optimal': return <ShieldCheck size={16} />;
      case 'High': return <BatteryCharging size={16} />;
      case 'Overloaded': return <AlertCircle size={16} />;
      case 'Underutilized': return <Battery size={16} />;
      default: return <Users size={16} />;
    }
  };

  return (
    <>
      <PageHeader 
        eyebrow="Workforce Analytics" 
        title="Resource Utilization" 
        description="Monitor department capacity, current workload, and identify resource bottlenecks across the organization." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
        <div className="bg-panel border border-line p-5 rounded-2xl flex flex-col gap-2">
          <p className="text-muted text-sm font-medium">Total Capacity</p>
          <p className="text-3xl font-bold text-white flex items-center gap-2"><Users size={24} className="text-indigo-400"/> 730</p>
        </div>
        <div className="bg-panel border border-line p-5 rounded-2xl flex flex-col gap-2">
          <p className="text-muted text-sm font-medium">Active Workload</p>
          <p className="text-3xl font-bold text-white flex items-center gap-2"><BatteryCharging size={24} className="text-blue-400"/> 640</p>
        </div>
        <div className="bg-panel border border-red-500/30 p-5 rounded-2xl flex flex-col gap-2">
          <p className="text-muted text-sm font-medium">Overloaded Teams</p>
          <p className="text-3xl font-bold text-red-400 flex items-center gap-2"><AlertCircle size={24}/> 1</p>
        </div>
        <div className="bg-panel border border-orange-500/30 p-5 rounded-2xl flex flex-col gap-2">
          <p className="text-muted text-sm font-medium">Underutilized Teams</p>
          <p className="text-3xl font-bold text-orange-400 flex items-center gap-2"><Battery size={24}/> 1</p>
        </div>
      </div>

      <div className="bg-panel border border-line rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-line bg-panel-2">
          <h3 className="font-semibold text-lg text-white">Department Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="p-4 font-semibold text-muted text-sm">Department</th>
                <th className="p-4 font-semibold text-muted text-sm">Capacity (Personnel)</th>
                <th className="p-4 font-semibold text-muted text-sm">Current Workload</th>
                <th className="p-4 font-semibold text-muted text-sm">Utilization %</th>
                <th className="p-4 font-semibold text-muted text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => {
                const utilPercentage = Math.round((dept.workload / dept.capacity) * 100);
                return (
                  <tr key={dept.id} className="border-b border-line hover:bg-panel-2 transition-colors">
                    <td className="p-4 text-white font-medium">{dept.name}</td>
                    <td className="p-4 text-slate-300">{dept.capacity}</td>
                    <td className="p-4 text-slate-300">{dept.workload}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-white w-10">{utilPercentage}%</span>
                        <div className="w-full max-w-[150px] bg-panel-3 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${utilPercentage > 100 ? 'bg-red-400' : utilPercentage < 60 ? 'bg-orange-400' : 'bg-emerald-400'}`} 
                            style={{ width: `${Math.min(utilPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 w-max ${getStatusColor(dept.status)}`}>
                        {getStatusIcon(dept.status)}
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
