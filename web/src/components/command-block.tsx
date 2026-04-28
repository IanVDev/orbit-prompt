type CommandBlockProps = {
  command: string;
  caption?: string;
  /**
   * Where the command runs. Defaults to "claude-code" because every install
   * step is typed inside Claude Code, not in a shell. Mislabeling this is
   * the #1 install error users hit.
   */
  runIn?: 'claude-code' | 'shell';
  ariaLabel?: string;
};

const RUN_IN_LABEL: Record<NonNullable<CommandBlockProps['runIn']>, string> = {
  'claude-code': 'Inside Claude Code',
  shell: 'In your terminal',
};

export function CommandBlock({
  command,
  caption,
  runIn = 'claude-code',
  ariaLabel,
}: CommandBlockProps) {
  return (
    <figure className="surface-strong overflow-hidden">
      <figcaption className="flex items-center justify-between border-b border-border-strong bg-bg-raised px-4 py-2 text-xs">
        <span className="font-medium text-fg-muted">{RUN_IN_LABEL[runIn]}</span>
        {caption ? <span className="text-fg-subtle">{caption}</span> : null}
      </figcaption>
      <pre
        aria-label={ariaLabel ?? `${RUN_IN_LABEL[runIn]} command`}
        className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed text-fg"
      >
        <code>{command}</code>
      </pre>
    </figure>
  );
}
