import type { Metadata } from "next";
import { CourseBrowser } from "@/components/course-browser";
import { getAllCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse all cybersecurity courses in the playbook.",
};

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="mt-2 text-muted-foreground">
          {courses.length} course{courses.length === 1 ? "" : "s"} across
          offensive and defensive security.
        </p>
      </div>
      <CourseBrowser courses={courses} />
    </div>
  );
}
