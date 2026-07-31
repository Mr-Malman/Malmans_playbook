"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCourseProgress } from "@/components/progress/use-progress";

export function MarkCompleteButton({
  courseSlug,
  chapterSlug,
}: {
  courseSlug: string;
  chapterSlug: string;
}) {
  const { isComplete, toggle, mounted } = useCourseProgress(courseSlug);
  const done = mounted && isComplete(chapterSlug);

  return (
    <Button
      variant={done ? "secondary" : "default"}
      onClick={() => toggle(chapterSlug)}
      className={cn(done && "text-primary")}
    >
      {done ? (
        <>
          <CheckCircle2 className="h-4 w-4" /> Completed
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" /> Mark complete
        </>
      )}
    </Button>
  );
}
