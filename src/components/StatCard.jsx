export default function StatCard({ stat, index }) {
  return <article className="group rounded-2xl border border-line bg-panel p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-500/70 hover:bg-panel-2">
    <div className="flex items-start justify-between"><p className="text-sm font-medium text-muted">{stat.label}</p><span className="text-xs text-slate-600">0{index + 1}</span></div>
    <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
    <p className={`mt-2 text-xs font-medium ${stat.tone}`}>{stat.change}</p>
  </article>;
}
