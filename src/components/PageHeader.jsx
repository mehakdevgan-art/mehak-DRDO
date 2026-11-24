export default function PageHeader({ eyebrow = 'Workspace overview', title, description, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft">{eyebrow}</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>{description && <p className="mt-2 text-sm text-muted">{description}</p>}</div>{action}</div>;
}
