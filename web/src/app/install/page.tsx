import type { Metadata } from 'next';
import Link from 'next/link';
import { CommandBlock } from '@/components/command-block';
import { INSTALL_COMMANDS, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Install',
  description: `Install ${SITE.name} as a Claude Code plugin in three commands.`,
};

export default function InstallPage() {
  return (
    <>
      <section className="container-page pt-16 pb-10">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="heading-eyebrow">Install</p>
          <h1 className="heading-1">Three commands inside Claude Code.</h1>
          <p className="lead">
            {SITE.name} is distributed as a Claude Code plugin. You don&rsquo;t need to clone this
            repository, download anything by hand, or paste anything into your terminal.
          </p>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mx-auto max-w-3xl">
          <div
            role="note"
            className="surface mb-8 border-l-4 border-l-warn px-5 py-4 text-sm text-fg"
          >
            <strong className="font-semibold">Do not paste these in zsh, bash, or PowerShell.</strong>{' '}
            Open Claude Code first, then type each command in the chat input. Pasting{' '}
            <code className="kbd">/plugin</code> in a terminal will fail with{' '}
            <code className="kbd">no such file or directory</code>.
          </div>

          <ol className="space-y-10">
            <li>
              <header className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-fg">Step 1 — Add the marketplace</h2>
                <span className="text-xs text-fg-subtle">~5s</span>
              </header>
              <CommandBlock
                command={INSTALL_COMMANDS.marketplace}
                ariaLabel="Marketplace add command"
                caption="claude code chat"
              />
              <p className="mt-3 text-sm text-fg-muted">
                Registers this repository as a plugin source inside Claude Code. You only do this
                once per machine.
              </p>
            </li>

            <li>
              <header className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-fg">Step 2 — Install the plugin</h2>
                <span className="text-xs text-fg-subtle">~10s</span>
              </header>
              <CommandBlock
                command={INSTALL_COMMANDS.install}
                ariaLabel="Plugin install command"
                caption="claude code chat"
              />
              <p className="mt-3 text-sm text-fg-muted">
                Downloads and installs <code className="kbd">{SITE.pluginName}</code> from the source
                you just added.
              </p>
            </li>

            <li>
              <header className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-fg">Step 3 — Reload plugins</h2>
                <span className="text-xs text-fg-subtle">~2s</span>
              </header>
              <CommandBlock
                command={INSTALL_COMMANDS.reload}
                ariaLabel="Reload plugins command"
                caption="claude code chat"
              />
              <p className="mt-3 text-sm text-fg-muted">
                Activates the plugin in the current session. After this,{' '}
                <code className="kbd">{SITE.command}</code> is live.
              </p>
            </li>

            <li>
              <header className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-fg">Step 4 — Confirm it works</h2>
                <span className="text-xs text-fg-subtle">~5s</span>
              </header>
              <p className="text-sm text-fg-muted">
                Type <code className="kbd">/</code> in Claude Code. You should see{' '}
                <code className="kbd">{SITE.command}</code> in the autocomplete list. If it
                doesn&rsquo;t appear, run <code className="kbd">{INSTALL_COMMANDS.reload}</code>{' '}
                once more and try again.
              </p>
            </li>
          </ol>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link href="/examples" className="btn-primary">
              Watch a 2-minute demo
            </Link>
            <Link href="/prompt" className="btn-ghost">
              See the output format
            </Link>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ghost"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="heading-2">Common errors</h2>

          <div className="surface space-y-2 p-6">
            <h3 className="font-semibold text-fg">
              <code className="kbd">/plugin</code> in your terminal
            </h3>
            <p className="text-sm text-fg-muted">
              Pasting a slash command in zsh, bash, or PowerShell fails with{' '}
              <code className="kbd">no such file or directory: /plugin</code>. Slash commands belong
              in Claude Code&rsquo;s chat input, never the OS shell.
            </p>
          </div>

          <div className="surface space-y-2 p-6">
            <h3 className="font-semibold text-fg">Plugin not found after marketplace add</h3>
            <p className="text-sm text-fg-muted">
              If step 2 reports{' '}
              <code className="kbd">Plugin &quot;orbit-prompt&quot; not found</code>, refresh the
              marketplace and run step 2 again:
            </p>
            <CommandBlock
              command={`/plugin marketplace update ${SITE.marketplaceSlug}`}
              ariaLabel="Marketplace update command"
              caption="claude code chat"
            />
          </div>

          <div className="surface space-y-2 p-6">
            <h3 className="font-semibold text-fg">Slash command doesn&rsquo;t appear</h3>
            <p className="text-sm text-fg-muted">
              Run <code className="kbd">{INSTALL_COMMANDS.reload}</code>, then type{' '}
              <code className="kbd">/</code> again. If autocomplete still doesn&rsquo;t list{' '}
              <code className="kbd">{SITE.command}</code>, restart Claude Code and confirm the
              install with <code className="kbd">/plugin list</code>.
            </p>
          </div>

          <div className="surface space-y-2 p-6">
            <h3 className="font-semibold text-fg">Manual fallback</h3>
            <p className="text-sm text-fg-muted">
              If you can&rsquo;t reach the marketplace (offline mirror, restricted environment),
              download the packaged artifact from{' '}
              <a
                className="text-accent hover:underline"
                href={SITE.releasesUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub releases
              </a>{' '}
              and install it via Claude Code → Settings → Skills. The marketplace flow above is the
              supported route.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
