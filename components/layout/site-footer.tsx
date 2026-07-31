import Link from "next/link";
import { ShieldHalf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldHalf className="h-4 w-4 text-primary" />
          <span>
            Malman&apos;s Playbook — private cybersecurity training platform.
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <span className="font-mono text-xs">
            For authorized training use only
          </span>
        </div>
      </div>
    </footer>
  );
}
