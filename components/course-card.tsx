import Link from "next/link";
import { BookMarked, Clock } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import { CourseIcon, colorClasses } from "@/lib/icons";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import type { CourseWithChapters } from "@/lib/courses";

export function CourseCard({ course }: { course: CourseWithChapters }) {
  const c = colorClasses(course.color);
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        c.ring
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent opacity-0 transition-opacity group-hover:opacity-100",
          c.from
        )}
      />
      <div className="mb-4 flex items-center justify-between">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg",
            c.bg,
            c.text
          )}
        >
          <CourseIcon name={course.icon} className="h-6 w-6" />
        </span>
        <DifficultyBadge level={course.difficulty} />
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {course.category}
      </p>
      <h3 className="mt-1 text-lg font-semibold leading-tight text-foreground">
        {course.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {course.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {course.tags.slice(0, 3).map((t) => (
          <Badge key={t} variant="outline" className="text-[11px]">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <BookMarked className="h-3.5 w-3.5" />
          {course.chapters.length} chapters
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatMinutes(course.totalDuration)}
        </span>
      </div>
    </Link>
  );
}
