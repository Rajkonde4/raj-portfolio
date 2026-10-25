import { Check, CircleDashed, Loader } from "lucide-react";

import type { FeatureStatus } from "@/types/content";
import { cn } from "@/lib/utils";

const config: Record<
  FeatureStatus,
  { label: string; Icon: typeof Check; className: string }
> = {
  implemented: {
    label: "Implemented",
    Icon: Check,
    className: "border-accent/60 text-accent",
  },
  "in-progress": {
    label: "In progress",
    Icon: Loader,
    className: "border-border-strong text-foreground",
  },
  planned: {
    label: "Planned",
    Icon: CircleDashed,
    className: "border-dashed border-border-strong text-muted",
  },
};

/**
 * Status chip. Meaning is carried by the word, the icon and the border style
 * (solid or dashed), never by color alone.
 */
export function StatusBadge({ status }: { status: FeatureStatus }) {
  const { label, Icon, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] tracking-wide uppercase",
        className,
      )}
    >
      <Icon aria-hidden className="size-3" />
      {label}
    </span>
  );
}
