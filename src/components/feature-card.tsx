type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="rounded-[24px] border border-border bg-panel p-5 shadow-[var(--shadow)] transition hover:border-accent hover:bg-accent-soft sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </article>
  );
}
