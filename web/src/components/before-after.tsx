type BeforeAfterProps = {
  title: string;
  description?: string;
  before: string;
  after: string;
  notes?: string[];
};

export function BeforeAfter({ title, description, before, after, notes }: BeforeAfterProps) {
  return (
    <article className="surface space-y-5 p-6">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-fg">{title}</h3>
        {description ? <p className="text-sm text-fg-muted">{description}</p> : null}
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-strong overflow-hidden">
          <div className="border-b border-border-strong bg-bg-raised px-4 py-2 text-xs font-medium text-danger">
            Before — vague
          </div>
          <pre className="whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm text-fg">
            <code>{before}</code>
          </pre>
        </div>
        <div className="surface-strong overflow-hidden">
          <div className="border-b border-border-strong bg-bg-raised px-4 py-2 text-xs font-medium text-success">
            After — structured
          </div>
          <pre className="whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm text-fg">
            <code>{after}</code>
          </pre>
        </div>
      </div>
      {notes && notes.length > 0 ? (
        <ul className="space-y-1 text-sm text-fg-muted">
          {notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
