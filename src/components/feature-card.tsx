type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="rounded-[24px] border border-border bg-panel p-6 shadow-[0_12px_30px_rgba(67,47,31,0.08)]">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </article>
  );
}
