import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const CONTENT_DIR = path.join(process.cwd(), "content", "courses");

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  /** lucide-react icon name, e.g. "globe" */
  icon: string;
  /** accent key used for the course color, e.g. "emerald" | "cyan" | "rose" */
  color: string;
  authors: string[];
  tags: string[];
  featured?: boolean;
  order?: number;
}

export interface ChapterMeta {
  courseSlug: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  duration: number; // minutes
  difficulty: Difficulty;
  tags: string[];
  /** optional YouTube video id */
  video?: string;
}

export interface Chapter extends ChapterMeta {
  /** raw MDX source (frontmatter stripped) */
  content: string;
}

export interface CourseWithChapters extends CourseMeta {
  chapters: ChapterMeta[];
  totalDuration: number;
}

function chapterSlugFromFile(file: string) {
  return file
    .replace(/\.mdx?$/, "")
    .replace(/^\d+[-_.]/, "");
}

function orderFromFile(file: string) {
  const m = file.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

export function getAllCourseSlugs(): string[] {
  return safeReadDir(CONTENT_DIR).filter((entry) => {
    const full = path.join(CONTENT_DIR, entry);
    return fs.existsSync(full) && fs.statSync(full).isDirectory();
  });
}

export function getCourseMeta(slug: string): CourseMeta | null {
  const file = path.join(CONTENT_DIR, slug, "course.json");
  if (!fs.existsSync(file)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return {
      slug,
      title: raw.title ?? slug,
      description: raw.description ?? "",
      category: raw.category ?? "General",
      difficulty: (raw.difficulty as Difficulty) ?? "beginner",
      icon: raw.icon ?? "book-open",
      color: raw.color ?? "emerald",
      authors: raw.authors ?? [],
      tags: raw.tags ?? [],
      featured: raw.featured ?? false,
      order: raw.order ?? 999,
    };
  } catch {
    return null;
  }
}

export function getChapterFiles(courseSlug: string): string[] {
  const dir = path.join(CONTENT_DIR, courseSlug, "chapters");
  return safeReadDir(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .sort((a, b) => orderFromFile(a) - orderFromFile(b));
}

export function getChapterMetaList(courseSlug: string): ChapterMeta[] {
  const dir = path.join(CONTENT_DIR, courseSlug, "chapters");
  return getChapterFiles(courseSlug).map((file, idx) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    return {
      courseSlug,
      slug: chapterSlugFromFile(file),
      title: data.title ?? chapterSlugFromFile(file),
      description: data.description ?? "",
      order: typeof data.order === "number" ? data.order : orderFromFile(file) || idx + 1,
      duration: typeof data.duration === "number" ? data.duration : 10,
      difficulty: (data.difficulty as Difficulty) ?? "beginner",
      tags: Array.isArray(data.tags) ? data.tags : [],
      video: data.video ?? undefined,
    };
  });
}

export function getCourse(slug: string): CourseWithChapters | null {
  const meta = getCourseMeta(slug);
  if (!meta) return null;
  const chapters = getChapterMetaList(slug);
  const totalDuration = chapters.reduce((sum, c) => sum + c.duration, 0);
  return { ...meta, chapters, totalDuration };
}

export function getAllCourses(): CourseWithChapters[] {
  return getAllCourseSlugs()
    .map(getCourse)
    .filter((c): c is CourseWithChapters => c !== null)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getChapter(
  courseSlug: string,
  chapterSlug: string
): Chapter | null {
  const dir = path.join(CONTENT_DIR, courseSlug, "chapters");
  const file = getChapterFiles(courseSlug).find(
    (f) => chapterSlugFromFile(f) === chapterSlug
  );
  if (!file) return null;
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  return {
    courseSlug,
    slug: chapterSlug,
    title: data.title ?? chapterSlug,
    description: data.description ?? "",
    order: typeof data.order === "number" ? data.order : orderFromFile(file),
    duration: typeof data.duration === "number" ? data.duration : 10,
    difficulty: (data.difficulty as Difficulty) ?? "beginner",
    tags: Array.isArray(data.tags) ? data.tags : [],
    video: data.video ?? undefined,
    content,
  };
}

export function getAdjacentChapters(courseSlug: string, chapterSlug: string) {
  const list = getChapterMetaList(courseSlug);
  const idx = list.findIndex((c) => c.slug === chapterSlug);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}

export function getAllChapterParams() {
  const params: { slug: string; chapter: string }[] = [];
  for (const slug of getAllCourseSlugs()) {
    for (const file of getChapterFiles(slug)) {
      params.push({ slug, chapter: chapterSlugFromFile(file) });
    }
  }
  return params;
}

/** Extract h2/h3 headings from raw MDX for the table of contents. */
export function extractToc(content: string) {
  const lines = content.split("\n");
  const toc: { depth: number; text: string; id: string }[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.*)$/);
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/[*`_]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      toc.push({ depth, text, id });
    }
  }
  return toc;
}
