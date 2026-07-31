import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  PlayCircle,
  ShieldHalf,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { getAllCourses } from "@/lib/courses";
import { formatMinutes } from "@/lib/utils";

export default function HomePage() {
  const courses = getAllCourses();
  const featured = courses.filter((c) => c.featured);
  const totalChapters = courses.reduce((s, c) => s + c.chapters.length, 0);
  const totalMinutes = courses.reduce((s, c) => s + c.totalDuration, 0);
  const categories = new Set(courses.map((c) => c.category)).size;

  const stats = [
    { label: "Courses", value: courses.length },
    { label: "Chapters", value: totalChapters },
    { label: "Content", value: formatMinutes(totalMinutes) },
    { label: "Domains", value: categories },
  ];

  const features = [
    {
      icon: GitBranch,
      title: "Live attack-path diagrams",
      body: "Interactive React Flow kill-chains and Mermaid diagrams rendered right in the lesson.",
    },
    {
      icon: TerminalSquare,
      title: "Copy-ready payloads",
      body: "Syntax-highlighted commands and payload boxes you can copy straight into your terminal.",
    },
    {
      icon: PlayCircle,
      title: "Video + notes",
      body: "Embedded walkthroughs with clickable chapter timestamps alongside written notes.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 cyber-grid" aria-hidden />
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" aria-hidden />
        <div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Private cybersecurity training platform
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Malman&apos;s <span className="text-gradient">Playbook</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              A living, interactive replacement for slide decks. Structured
              courses on offensive and defensive security — with diagrams,
              labs, payloads, and video, all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="glow-primary">
                <Link href="/courses">
                  Browse courses <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {courses[0] && (
                <Button asChild size="lg" variant="outline">
                  <Link href={`/courses/${courses[0].slug}`}>
                    Start with {courses[0].title}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card/60 p-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-bold text-foreground">
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / all courses */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {featured.length ? "Featured courses" : "Courses"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked paths to get you started.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex">
            <Link href="/courses">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(featured.length ? featured : courses).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Built for how security is actually taught
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
      <ShieldHalf className="h-10 w-10 text-muted-foreground" />
      <p className="mt-4 font-medium">No courses yet</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add a course folder under <code className="text-accent">content/courses</code>{" "}
        with a <code className="text-accent">course.json</code> and some MDX
        chapters to get started.
      </p>
    </div>
  );
}
