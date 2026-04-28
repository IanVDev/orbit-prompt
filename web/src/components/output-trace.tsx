import { OUTPUT_BLOCKS } from '@/lib/site';

type Trace = {
  label: (typeof OUTPUT_BLOCKS)[number];
  body: string;
};

type OutputTraceProps = {
  title?: string;
  trace: Trace[];
};

export function OutputTrace({ title = 'Output', trace }: OutputTraceProps) {
  return (
    <figure className="surface-strong overflow-hidden">
      <figcaption className="border-b border-border-strong bg-bg-raised px-4 py-2 text-xs font-medium text-fg-muted">
        {title}
      </figcaption>
      <div className="space-y-4 px-4 py-5 font-mono text-sm leading-relaxed">
        {trace.map((entry) => (
          <div key={entry.label} className="space-y-1">
            <div className="text-xs font-semibold tracking-wider text-accent">{entry.label}</div>
            <pre className="whitespace-pre-wrap break-words text-fg">
              <code>{entry.body}</code>
            </pre>
          </div>
        ))}
      </div>
    </figure>
  );
}
