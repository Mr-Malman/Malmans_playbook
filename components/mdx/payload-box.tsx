"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";

export function PayloadBox({
  label = "Payload",
  language,
  children,
}: {
  label?: string;
  language?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLPreElement>(null);

  const onCopy = async () => {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="my-5 overflow-hidden rounded-lg border border-primary/40 bg-[#0b1120]">
      <div className="flex items-center justify-between border-b border-primary/20 bg-primary/10 px-3 py-1.5">
        <span className="flex items-center gap-2 font-mono text-xs font-semibold text-primary">
          <Terminal className="h-3.5 w-3.5" />
          {label}
          {language && (
            <span className="text-muted-foreground">· {language}</span>
          )}
        </span>
        <button
          onClick={onCopy}
          aria-label="Copy payload"
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre
        ref={ref}
        className="overflow-x-auto px-3 py-3 font-mono text-[13px] leading-6 text-emerald-300 scrollbar-thin"
      >
        {children}
      </pre>
    </div>
  );
}
