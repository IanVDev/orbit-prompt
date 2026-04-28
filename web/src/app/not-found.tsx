import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-24">
      <div className="max-w-md space-y-4 text-center">
        <p className="heading-eyebrow">404</p>
        <h1 className="heading-1">Page not found.</h1>
        <p className="lead">
          The link you followed is broken or the page was renamed. Head back to the start.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/" className="btn-primary">
            Home
          </Link>
          <Link href="/install" className="btn-ghost">
            Install
          </Link>
        </div>
      </div>
    </section>
  );
}
