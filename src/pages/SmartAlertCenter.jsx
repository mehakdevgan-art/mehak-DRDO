import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Filter, Search } from 'lucide-react';

export default function SmartAlertCenter() {
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');

  const alerts = [
    { id: 1, type: 'critical', title: 'Critical Procurement Delay', message: 'Delayed delivery of specialized sensors is threatening the Autonomous UAV Platform schedule.', project: 'Autonomous UAV Platform', department: 'AI Lab', time: '10m ago' },
    { id: 2, type: 'warning', title: 'Budget Utilization High', message: 'Naval Surveillance System budget utilization exceeded 85%.', project: 'Naval Surveillance System', department: 'Radar Systems', time: '1h ago' },
    { id: 3, type: 'success', title: 'Milestone Completed', message: 'Hardware validation phase completed successfully ahead of schedule.', project: 'Secure Defence Communication', department: 'Communication', time: '2h ago' },
    { id: 4, type: 'info', title: 'Resource Overallocation', message: 'Embedded Systems engineering team is currently operating at 115% capacity.', project: 'Electronic Warfare Suite', department: 'Embedded Systems', time: '3h ago' },
    { id: 5, type: 'critical', title: 'High-Risk Dependency', message: 'Testing phase behind schedule due to unavailability of the wind tunnel facility.', project: 'Missile Guidance Enhancement', department: 'Research Division', time: '5h ago' },
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

  const getBorderColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500/30';
      case 'warning': return 'border-orange-500/30';
      case 'success': return 'border-emerald-500/30';
      case 'info': return 'border-blue-500/30';
      default: return 'border-gray-500/30';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'All' && alert.type !== filterSeverity.toLowerCase()) return false;
    if (filterDepartment !== 'All' && alert.department !== filterDepartment) return false;
    return true;
  });

  return (
    <>
      <PageHeader 
        eyebrow="Monitoring operations" 
        title="Smart Alert Center" 
        description="Automated system alerts, warnings, and notifications across all DRDO projects." 
      />

      <div className="mt-6 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-3 bg-panel border border-line rounded-lg p-2 px-4 flex-1">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search alerts..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted" />
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-panel border border-line rounded-lg p-2 px-4">
            <Filter size={16} className="text-muted" />
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white"
            >
              <option value="All">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-panel border border-line rounded-lg p-2 px-4">
            <Filter size={16} className="text-muted" />
            <select 
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white"
            >
              <option value="All">All Departments</option>
              <option value="Radar Systems">Radar Systems</option>
              <option value="Communication">Communication</option>
              <option value="AI Lab">AI Lab</option>
              <option value="Embedded Systems">Embedded Systems</option>
              <option value="Research Division">Research Division</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-muted bg-panel rounded-xl border border-line">
            No alerts found matching the current filters.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div key={alert.id} className={`p-5 rounded-xl border ${getBorderColor(alert.type)} bg-panel hover:bg-panel-2 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center`}>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-panel-2 p-2 rounded-lg border border-line">{getIcon(alert.type)}</div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{alert.title}</h3>
                  <p className="text-muted text-sm mt-1">{alert.message}</p>
                  <div className="flex gap-3 mt-3 text-xs">
                    <span className="bg-panel-3 px-2 py-1 rounded text-slate-300">Project: {alert.project}</span>
                    <span className="bg-panel-3 px-2 py-1 rounded text-slate-300">Dept: {alert.department}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted whitespace-nowrap bg-panel-2 px-3 py-1.5 rounded-full border border-line">{alert.time}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
