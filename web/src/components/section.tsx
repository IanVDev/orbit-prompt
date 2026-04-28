type SectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  id?: string;
};

export function Section({ eyebrow, title, description, children, id }: SectionProps) {
  return (
    <section id={id} className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        {eyebrow ? <p className="heading-eyebrow">{eyebrow}</p> : null}
        <h2 className="heading-2">{title}</h2>
        {description ? <p className="lead">{description}</p> : null}
      </div>
      {children ? <div className="mt-12">{children}</div> : null}
    </section>
  );
}
