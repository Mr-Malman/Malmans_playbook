"use client";

import * as React from "react";
import Fuse from "fuse.js";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseCard } from "@/components/course-card";
import type { CourseWithChapters, Difficulty } from "@/lib/courses";

const DIFFICULTIES: (Difficulty | "all")[] = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
];

export function CourseBrowser({
  courses,
}: {
  courses: CourseWithChapters[];
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [difficulty, setDifficulty] = React.useState<Difficulty | "all">("all");

  const categories = React.useMemo(
    () => ["all", ...Array.from(new Set(courses.map((c) => c.category)))],
    [courses]
  );

  const fuse = React.useMemo(
    () =>
      new Fuse(courses, {
        keys: ["title", "description", "tags", "category"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [courses]
  );

  const results = React.useMemo(() => {
    let list = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : courses;
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (difficulty !== "all")
      list = list.filter((c) => c.difficulty === difficulty);
    return list;
  }, [query, category, difficulty, courses, fuse]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, topics, tools…"
            className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none ring-primary/40 transition focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                category === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                difficulty === d
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "course" : "courses"}
      </p>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No courses match your filters.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
