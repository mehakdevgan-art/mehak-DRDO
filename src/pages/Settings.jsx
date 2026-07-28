import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Settings as SettingsIcon, Building, ShieldAlert, Bell, Save } from 'lucide-react';

export default function Settings() {
  const [formData, setFormData] = useState({
    orgName: 'DRDO',
    financialYear: '2026-2027',
    riskThreshold: '75',
    budgetThreshold: '90',
    notifyEmail: true,
    notifyPush: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving settings
    alert('Settings saved successfully (Simulation)');
  };

  return (
    <>
      <PageHeader 
        eyebrow="System Configuration" 
        title="Organization Settings" 
        description="Manage organization preferences, risk thresholds, and notification rules." 
      />

      <form onSubmit={handleSubmit} className="mt-6 max-w-4xl grid gap-8">
        
        {/* General Settings */}
        <section className="bg-panel border border-line rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
            <Building className="text-indigo-400" size={20} />
            <h2 className="text-lg font-semibold text-white">General Information</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Organization Name</label>
              <input 
                type="text" name="orgName" value={formData.orgName} onChange={handleChange}
                className="bg-panel-2 border border-line rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Current Financial Year</label>
              <select 
                name="financialYear" value={formData.financialYear} onChange={handleChange}
                className="bg-panel-2 border border-line rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors"
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>
          </div>
        </section>

        {/* Threshold Settings */}
        <section className="bg-panel border border-line rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
            <ShieldAlert className="text-orange-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Risk & Budget Thresholds</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">High Risk Threshold (Score &lt; X)</label>
              <input 
                type="number" name="riskThreshold" value={formData.riskThreshold} onChange={handleChange}
                className="bg-panel-2 border border-line rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors"
              />
              <p className="text-xs text-muted">Projects scoring below this will be flagged as High Risk.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Budget Warning Threshold (%)</label>
              <input 
                type="number" name="budgetThreshold" value={formData.budgetThreshold} onChange={handleChange}
                className="bg-panel-2 border border-line rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors"
              />
              <p className="text-xs text-muted">Alerts generated when utilized budget exceeds this percentage.</p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-panel border border-line rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
            <Bell className="text-emerald-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" name="notifyEmail" checked={formData.notifyEmail} onChange={handleChange}
                className="w-5 h-5 rounded border-line bg-panel-2 text-indigo-500 focus:ring-indigo-500/20"
              />
              <span className="text-slate-300 font-medium">Email Notifications for Critical Alerts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" name="notifyPush" checked={formData.notifyPush} onChange={handleChange}
                className="w-5 h-5 rounded border-line bg-panel-2 text-indigo-500 focus:ring-indigo-500/20"
              />
              <span className="text-slate-300 font-medium">In-App Push Notifications</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </>
  );
}
