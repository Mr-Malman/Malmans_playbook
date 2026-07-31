import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/courses";

const MAP: Record<Difficulty, { label: string; variant: "success" | "warning" | "destructive" }> = {
  beginner: { label: "Beginner", variant: "success" },
  intermediate: { label: "Intermediate", variant: "warning" },
  advanced: { label: "Advanced", variant: "destructive" },
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const { label, variant } = MAP[level] ?? MAP.beginner;
  return <Badge variant={variant}>{label}</Badge>;
}
