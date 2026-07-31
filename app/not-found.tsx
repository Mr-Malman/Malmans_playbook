import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <ShieldAlert className="h-12 w-12 text-primary" />
      <h1 className="mt-6 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        That route isn&apos;t part of the playbook — it may have moved or never
        existed.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
