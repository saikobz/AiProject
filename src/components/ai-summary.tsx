function cleanSummaryLine(line: string) {
  return line
    .replace(/^[-*•]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function getSummaryPoints(summary: string) {
  const lines = summary
    .split(/\r?\n/)
    .map(cleanSummaryLine)
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  const inlineBullets = summary
    .replace(/\*\*/g, "")
    .split(/\s+(?=(?:[-*•]\s)|(?:\d+[.)]\s))/)
    .map(cleanSummaryLine)
    .filter(Boolean);

  return inlineBullets.length > 1 ? inlineBullets : [];
}

type AiSummaryProps = {
  summary: string;
};

export function AiSummary({ summary }: AiSummaryProps) {
  const points = getSummaryPoints(summary);

  if (points.length === 0) {
    return <p className="mt-3 text-sm leading-7 text-muted">{summary.replace(/\*\*/g, "")}</p>;
  }

  return (
    <ul className="mt-4 space-y-3">
      {points.map((point) => (
        <li key={point} className="flex gap-3 text-sm leading-7 text-muted">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}
