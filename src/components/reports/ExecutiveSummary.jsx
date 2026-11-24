import React from 'react';
import { FileText, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Download } from 'lucide-react';

export default function ExecutiveSummary({ data, onExport }) {
  if (!data) return null;

  return (
    <div className="bg-panel border border-line rounded-2xl p-8 max-w-4xl mx-auto shadow-xl relative">
      {onExport && (
        <button 
          onClick={onExport} 
          className="absolute top-8 right-8 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} /> Export PDF
        </button>
      )}

      <div className="flex items-center gap-3 mb-8 border-b border-line pb-6">
        <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
          <FileText className="text-indigo-400 w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Project Summary</h1>
          <p className="text-muted text-sm mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={18} /> Overall Progress
          </h2>
          <div className="bg-panel-2 rounded-xl p-5 border border-line">
            <div className="flex justify-between items-end mb-2">
              <span className="text-4xl font-bold text-white">{data.progress || 0}%</span>
              <span className="text-sm text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 rounded">On Track</span>
            </div>
            <div className="w-full bg-panel-3 rounded-full h-2 mt-4">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${data.progress || 0}%` }} />
            </div>
            <p className="text-sm text-muted mt-4 leading-relaxed">
              The portfolio is currently meeting its strategic objectives with minor delays in 2 sub-projects, offset by early completions in the aeronautics division.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="text-blue-400" size={18} /> Budget Status
          </h2>
          <div className="bg-panel-2 rounded-xl p-5 border border-line">
             <div className="flex justify-between items-end mb-2">
              <span className="text-4xl font-bold text-white">{data.budgetUtilized || 0}%</span>
              <span className="text-sm text-blue-400 font-medium bg-blue-400/10 px-2 py-1 rounded">Optimized</span>
            </div>
            <div className="w-full bg-panel-3 rounded-full h-2 mt-4">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${data.budgetUtilized || 0}%` }} />
            </div>
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Budget utilization is well within the acceptable threshold. Total expenditure stands at ₹{data.expenditure} Cr against an allocated ₹{data.allocation} Cr.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="text-orange-400" size={18} /> Key Risks
        </h2>
        <div className="grid gap-3">
          {data.risks?.map((risk, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-line bg-panel-2 items-start">
              <div className={`mt-0.5 w-2 h-2 rounded-full ${risk.level === 'High' ? 'bg-red-400' : 'bg-orange-400'}`} />
              <div>
                <h4 className="font-medium text-slate-200">{risk.title}</h4>
                <p className="text-sm text-muted mt-1">{risk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="text-indigo-400" size={18} /> Strategic Recommendations
        </h2>
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
          <ul className="space-y-3">
            {data.recommendations?.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                <span className="text-indigo-400 font-bold">{i + 1}.</span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
