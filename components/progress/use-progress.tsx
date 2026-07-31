"use client";

import * as React from "react";

const KEY = "mp:progress";
const EVENT = "mp-progress";

type Store = Record<string, string[]>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(EVENT));
}

/** Reactive per-course completion state backed by localStorage. */
export function useCourseProgress(courseSlug: string) {
  const [completed, setCompleted] = React.useState<string[]>([]);
  const [mounted, setMounted] = React.useState(false);

  const refresh = React.useCallback(() => {
    setCompleted(read()[courseSlug] ?? []);
  }, [courseSlug]);

  React.useEffect(() => {
    setMounted(true);
    refresh();
    const handler = () => refresh();
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const toggle = React.useCallback(
    (chapter: string) => {
      const store = read();
      const set = new Set(store[courseSlug] ?? []);
      if (set.has(chapter)) set.delete(chapter);
      else set.add(chapter);
      store[courseSlug] = Array.from(set);
      write(store);
    },
    [courseSlug]
  );

  const setComplete = React.useCallback(
    (chapter: string, value: boolean) => {
      const store = read();
      const set = new Set(store[courseSlug] ?? []);
      if (value) set.add(chapter);
      else set.delete(chapter);
      store[courseSlug] = Array.from(set);
      write(store);
    },
    [courseSlug]
  );

  const isComplete = React.useCallback(
    (chapter: string) => completed.includes(chapter),
    [completed]
  );

  return { completed, mounted, toggle, setComplete, isComplete };
}
