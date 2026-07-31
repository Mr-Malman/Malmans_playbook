import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { MdxContent } from "@/components/mdx";
import { YouTube } from "@/components/mdx/youtube";
import { ChapterSidebar } from "@/components/chapter-sidebar";
import { Toc } from "@/components/toc";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";
import {
  extractToc,
  getAdjacentChapters,
  getAllChapterParams,
  getChapter,
  getChapterMetaList,
  getCourse,
} from "@/lib/courses";

export function generateStaticParams() {
  return getAllChapterParams();
}

export function generateMetadata({
  params,
}: {
  params: { slug: string; chapter: string };
}): Metadata {
  const chapter = getChapter(params.slug, params.chapter);
  if (!chapter) return {};
  return { title: chapter.title, description: chapter.description };
}

export default function ChapterPage({
  params,
}: {
  params: { slug: string; chapter: string };
}) {
  const course = getCourse(params.slug);
  const chapter = getChapter(params.slug, params.chapter);
  if (!course || !chapter) notFound();

  const chapters = getChapterMetaList(params.slug);
  const { prev, next } = getAdjacentChapters(params.slug, params.chapter);
  const toc = extractToc(chapter.content);

  return (
    <div className="mx-auto lg:grid lg:max-w-[1600px] lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Left: chapter nav */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r border-border lg:block">
        <ChapterSidebar
          courseSlug={course.slug}
          courseTitle={course.title}
          chapters={chapters}
        />
      </aside>

      {/* Right: content + toc */}
      <div className="min-w-0">
        <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 sm:px-8">
          <article className="min-w-0 max-w-3xl flex-1">
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <DifficultyBadge level={chapter.difficulty} />
                <Badge variant="secondary">
                  <Clock className="h-3 w-3" />
                  {formatMinutes(chapter.duration)}
                </Badge>
                {chapter.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {chapter.title}
              </h1>
              {chapter.description && (
                <p className="mt-3 text-lg text-muted-foreground">
                  {chapter.description}
                </p>
              )}
            </div>

            {chapter.video && (
              <YouTube id={chapter.video} title={chapter.title} />
            )}

            <div className="prose-playbook">
              <MdxContent source={chapter.content} />
            </div>

            {/* Actions */}
            <div className="mt-12 border-t border-border pt-6">
              <MarkCompleteButton
                courseSlug={course.slug}
                chapterSlug={chapter.slug}
              />
            </div>

            {/* Prev / next */}
            <nav className="mt-6 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/courses/${course.slug}/${prev.slug}`}
                  className="group flex flex-col rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous
                  </span>
                  <span className="mt-1 font-medium group-hover:text-primary">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/courses/${course.slug}/${next.slug}`}
                  className="group flex flex-col rounded-lg border border-border p-4 text-right transition-colors hover:border-primary/40"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-1 font-medium group-hover:text-primary">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </article>

          {/* TOC */}
          <aside className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-24">
              <Toc items={toc} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
