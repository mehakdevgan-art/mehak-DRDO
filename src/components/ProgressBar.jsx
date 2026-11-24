export default function ProgressBar({ value, className = '' }) {
  return <div className={`h-1.5 overflow-hidden rounded-full bg-slate-700/70 ${className}`}><div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} /></div>;
}
