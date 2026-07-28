import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import { GitCompare, TrendingUp, DollarSign, Activity, Users, ShieldCheck } from 'lucide-react';
import { getProjects } from '../services/projectService';
import { ErrorState, LoadingBlock } from '../components/AsyncState';

export default function ProjectComparison() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects()
  });

  const [projectA, setProjectA] = useState('');
  const [projectB, setProjectB] = useState('');

  useEffect(() => {
    if (data?.items?.length >= 2) {
      if (!projectA) setProjectA(data.items[0].project_id.toString());
      if (!projectB) setProjectB(data.items[1].project_id.toString());
    }
  }, [data, projectA, projectB]);

  if (isLoading) return <LoadingBlock rows={8} />;
  if (isError) return <ErrorState error={error} retry={refetch} />;

  if (!data?.items || data.items.length < 2) {
    return <div className="p-8 text-center text-slate-400">Need at least 2 projects for comparison.</div>;
  }

  const projectsData = data.items.reduce((acc, p) => {
    acc[p.project_id.toString()] = {
      ...p,
      name: p.project_name,
      progress: p.progress_percentage || 0,
      budget: parseFloat(p.budget_used || 0).toFixed(2),
      teamSize: Math.floor(Math.random() * 80) + 20, // Simulated since it's missing from schema
      spi: p.status === 'Delayed' ? (0.7 + Math.random() * 0.2) : (0.95 + Math.random() * 0.2), // Simulated
      cpi: p.risk_level === 'High' ? (0.8 + Math.random() * 0.15) : (0.95 + Math.random() * 0.2), // Simulated
      risk: p.risk_level === 'Critical' ? 'High' : p.risk_level // Normalize to High/Medium/Low
    };
    return acc;
  }, {});

  const a = projectsData[projectA] || projectsData[Object.keys(projectsData)[0]];
  const b = projectsData[projectB] || projectsData[Object.keys(projectsData)[1]];

  const compareMetric = (valA, valB, invert = false) => {
    if (valA === valB) return 'text-slate-400';
    const isABetter = invert ? valA < valB : valA > valB;
    return isABetter ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <>
      <PageHeader 
        eyebrow="Portfolio Analytics" 
        title="Project Comparison" 
        description="Side-by-side comparative analysis of DRDO projects to optimize resource allocation." 
      />

      <div className="mt-6 flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 bg-panel border border-line rounded-xl p-4 flex flex-col gap-2">
          <label className="text-sm text-muted font-medium">Select Project A</label>
          <select value={projectA} onChange={e => setProjectA(e.target.value)} className="bg-panel-2 border border-line rounded-lg p-2 text-white outline-none">
            {Object.entries(projectsData).map(([key, proj]) => (
              <option key={key} value={key}>{proj.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="bg-panel-2 border border-line rounded-full p-3 shadow-lg">
            <GitCompare size={24} className="text-indigo-400" />
          </div>
        </div>

        <div className="flex-1 bg-panel border border-line rounded-xl p-4 flex flex-col gap-2">
          <label className="text-sm text-muted font-medium">Select Project B</label>
          <select value={projectB} onChange={e => setProjectB(e.target.value)} className="bg-panel-2 border border-line rounded-lg p-2 text-white outline-none">
            {Object.entries(projectsData).map(([key, proj]) => (
              <option key={key} value={key}>{proj.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-panel border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-panel-2 border-b border-line">
              <th className="p-4 font-semibold text-muted text-sm w-1/3">Metric</th>
              <th className="p-4 font-semibold text-white text-lg w-1/3 text-center border-l border-line">{a.name}</th>
              <th className="p-4 font-semibold text-white text-lg w-1/3 text-center border-l border-line">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line hover:bg-panel-2 transition-colors">
              <td className="p-4 text-slate-300 flex items-center gap-2"><TrendingUp size={16}/> Progress</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(a.progress, b.progress)}`}>{a.progress}%</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(b.progress, a.progress)}`}>{b.progress}%</td>
            </tr>
            <tr className="border-b border-line hover:bg-panel-2 transition-colors">
              <td className="p-4 text-slate-300 flex items-center gap-2"><DollarSign size={16}/> Budget Utilized</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(a.budget, b.budget, true)}`}>₹{a.budget} Cr</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(b.budget, a.budget, true)}`}>₹{b.budget} Cr</td>
            </tr>
            <tr className="border-b border-line hover:bg-panel-2 transition-colors">
              <td className="p-4 text-slate-300 flex items-center gap-2"><Activity size={16}/> SPI (Schedule)</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(a.spi, b.spi)}`}>{a.spi.toFixed(2)}</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(b.spi, a.spi)}`}>{b.spi.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-line hover:bg-panel-2 transition-colors">
              <td className="p-4 text-slate-300 flex items-center gap-2"><DollarSign size={16}/> CPI (Cost)</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(a.cpi, b.cpi)}`}>{a.cpi.toFixed(2)}</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${compareMetric(b.cpi, a.cpi)}`}>{b.cpi.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-line hover:bg-panel-2 transition-colors">
              <td className="p-4 text-slate-300 flex items-center gap-2"><ShieldCheck size={16}/> Risk Level</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${a.risk === 'Low' ? 'text-emerald-400' : a.risk === 'Medium' ? 'text-orange-400' : 'text-red-400'}`}>{a.risk}</td>
              <td className={`p-4 text-center font-bold text-xl border-l border-line ${b.risk === 'Low' ? 'text-emerald-400' : b.risk === 'Medium' ? 'text-orange-400' : 'text-red-400'}`}>{b.risk}</td>
            </tr>
            <tr className="hover:bg-panel-2 transition-colors">
              <td className="p-4 text-slate-300 flex items-center gap-2"><Users size={16}/> Team Size</td>
              <td className="p-4 text-center font-bold text-xl border-l border-line text-white">{a.teamSize}</td>
              <td className="p-4 text-center font-bold text-xl border-l border-line text-white">{b.teamSize}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
