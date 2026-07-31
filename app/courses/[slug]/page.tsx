import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookMarked, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { ChapterList } from "@/components/chapter-list";
import { CourseProgressBar } from "@/components/course-progress-bar";
import { CourseIcon, colorClasses } from "@/lib/icons";
import { cn, formatMinutes } from "@/lib/utils";
import { getAllCourseSlugs, getCourse } from "@/lib/courses";

export function generateStaticParams() {
  return getAllCourseSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const course = getCourse(params.slug);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourse(params.slug);
  if (!course) notFound();

  const c = colorClasses(course.color);
  const first = course.chapters[0];

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
                c.bg,
                c.text
              )}
            >
              <CourseIcon name={course.icon} className="h-7 w-7" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {course.category}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {course.title}
              </h1>
            </div>
          </div>

          <p className="mt-5 text-lg text-muted-foreground">
            {course.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <DifficultyBadge level={course.difficulty} />
            <Badge variant="secondary">
              <BookMarked className="h-3 w-3" />
              {course.chapters.length} chapters
            </Badge>
            <Badge variant="secondary">
              <Clock className="h-3 w-3" />
              {formatMinutes(course.totalDuration)}
            </Badge>
            {course.authors.length > 0 && (
              <Badge variant="secondary">
                <Users className="h-3 w-3" />
                {course.authors.join(", ")}
              </Badge>
            )}
          </div>

          {course.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {course.tags.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">Chapters</h2>
            {course.chapters.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                No chapters published yet.
              </p>
            ) : (
              <ChapterList
                courseSlug={course.slug}
                chapters={course.chapters}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {first && (
            <Button asChild size="lg" className="w-full">
              <Link href={`/courses/${course.slug}/${first.slug}`}>
                Start course <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <CourseProgressBar
            courseSlug={course.slug}
            total={course.chapters.length}
          />
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <h3 className="mb-2 font-medium">What you&apos;ll work with</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>· Interactive diagrams &amp; attack paths</li>
              <li>· Copy-ready payloads and commands</li>
              <li>· Video walkthroughs with timestamps</li>
              <li>· Defensive countermeasures per topic</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
