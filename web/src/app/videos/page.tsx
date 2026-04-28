import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Videos',
  description: `Short walkthroughs of ${SITE.name}: install, prompt analysis, debugging, and PR review.`,
};

type Video = {
  slug: string;
  title: string;
  duration: string;
  summary: string;
  commands: string[];
  status: 'live' | 'coming-soon';
  youtubeId?: string;
};

const videos: Video[] = [
  {
    slug: 'install',
    title: 'Install Orbit Prompt in Claude Code',
    duration: '1:30',
    summary:
      'Add the marketplace, install the plugin, reload, and run /orbit-prompt for the first time.',
    commands: [
      '/plugin marketplace add IanVDev/orbit-prompt',
      '/plugin install orbit-prompt@orbit-prompt',
      '/reload-plugins',
    ],
    status: 'coming-soon',
  },
  {
    slug: 'prompt-analysis',
    title: 'Turn a rough idea into a structured prompt',
    duration: '2:00',
    summary:
      'Same task, two prompts. Watch how the structured one finishes in one turn while the vague one starts a correction loop.',
    commands: ['/orbit-prompt refactor the auth module'],
    status: 'coming-soon',
  },
  {
    slug: 'debug-and-review',
    title: 'Use Orbit Prompt for debugging and PR review',
    duration: '2:30',
    summary:
      'Two real cases — a duplicated slash command and a PR review checklist — both rephrased into prompts that produce clean output.',
    commands: [
      '/orbit-prompt slash command appears twice in autocomplete',
      '/orbit-prompt review PR #42 for safety',
    ],
    status: 'coming-soon',
  },
];

export default function VideosPage() {
  return (
    <>
      <section className="container-page pt-16 pb-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="heading-eyebrow">Videos</p>
          <h1 className="heading-1">Short walkthroughs, no filler.</h1>
          <p className="lead">
            Each clip is under 3 minutes and ships with the exact commands used. If a video
            doesn&rsquo;t load, the textual recap below is enough to follow along.
          </p>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="mx-auto grid max-w-5xl gap-6">
          {videos.map((video) => (
            <article key={video.slug} className="surface overflow-hidden">
              <div className="grid gap-0 md:grid-cols-2">
                <div className="relative aspect-video bg-bg-subtle">
                  {video.status === 'live' && video.youtubeId ? (
                    <iframe
                      title={video.title}
                      src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                      allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      <span className="badge">Recording soon</span>
                      <p className="max-w-[28ch] px-4 text-sm text-fg-muted">
                        Until the video is up, follow the commands and recap on the right.
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-6">
                  <header className="space-y-1">
                    <p className="text-xs text-fg-subtle">{video.duration}</p>
                    <h2 className="text-lg font-semibold text-fg">{video.title}</h2>
                  </header>
                  <p className="text-sm text-fg-muted">{video.summary}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                      Commands used
                    </p>
                    <ul className="mt-2 space-y-1">
                      {video.commands.map((cmd) => (
                        <li key={cmd}>
                          <code className="kbd block w-fit max-w-full overflow-x-auto whitespace-pre">
                            {cmd}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-bg-raised p-8 text-center">
          <h2 className="text-xl font-semibold text-fg">Prefer text?</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Every video maps to a written walkthrough. Read the install guide or the example set —
            no playback required.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/install" className="btn-primary">
              Install guide
            </Link>
            <Link href="/examples" className="btn-ghost">
              Example set
            </Link>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ghost"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
