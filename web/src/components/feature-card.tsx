type FeatureCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="surface space-y-3 p-6">
      {icon ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-subtle text-accent">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <p className="text-sm text-fg-muted">{description}</p>
    </div>
  );
}
