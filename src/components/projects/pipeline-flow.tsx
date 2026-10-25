import { StatusBadge } from "@/components/shared/status-badge";
import type { PipelineStage } from "@/types/content";

/**
 * Ordered stages of a system, each with its own honest status. Rendered as an
 * ordered list so the sequence is announced by screen readers.
 */
export function PipelineFlow({ stages }: { stages: PipelineStage[] }) {
  return (
    <ol className="relative">
      {stages.map((stage, index) => (
        <li
          key={stage.id}
          className="scroll-reveal relative grid gap-x-6 gap-y-2 border-t border-border py-6 first:border-t-0 sm:grid-cols-[3rem_1fr_auto] sm:items-start"
        >
          <span
            aria-hidden="true"
            className="font-mono text-sm text-muted tabular-nums"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-serif text-2xl tracking-tight">
              {stage.label}
            </h3>
            {stage.technology && (
              <p className="mt-1 font-mono text-xs text-accent">
                {stage.technology}
              </p>
            )}
            <p className="mt-2 max-w-xl text-muted">{stage.description}</p>
          </div>
          <div className="sm:justify-self-end">
            <StatusBadge status={stage.status} />
          </div>
        </li>
      ))}
    </ol>
  );
}
