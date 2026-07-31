import {
  BookOpen,
  Bug,
  Cloud,
  Code2,
  Cpu,
  Database,
  Fingerprint,
  Globe,
  KeyRound,
  Lock,
  Network,
  Radio,
  Server,
  Shield,
  ShieldHalf,
  Skull,
  Smartphone,
  Terminal,
  Wifi,
  Worm,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  bug: Bug,
  cloud: Cloud,
  code: Code2,
  cpu: Cpu,
  database: Database,
  fingerprint: Fingerprint,
  globe: Globe,
  key: KeyRound,
  lock: Lock,
  network: Network,
  radio: Radio,
  server: Server,
  shield: Shield,
  "shield-half": ShieldHalf,
  skull: Skull,
  smartphone: Smartphone,
  terminal: Terminal,
  wifi: Wifi,
  worm: Worm,
};

export function CourseIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? BookOpen;
  return <Icon className={className} />;
}

/** Accent color classes keyed by the course `color` field. */
export const COLOR_CLASSES: Record<
  string,
  { text: string; bg: string; ring: string; from: string }
> = {
  emerald: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    ring: "group-hover:border-emerald-500/50",
    from: "from-emerald-500/20",
  },
  cyan: {
    text: "text-cyan-500",
    bg: "bg-cyan-500/10",
    ring: "group-hover:border-cyan-500/50",
    from: "from-cyan-500/20",
  },
  rose: {
    text: "text-rose-500",
    bg: "bg-rose-500/10",
    ring: "group-hover:border-rose-500/50",
    from: "from-rose-500/20",
  },
  amber: {
    text: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "group-hover:border-amber-500/50",
    from: "from-amber-500/20",
  },
  violet: {
    text: "text-violet-500",
    bg: "bg-violet-500/10",
    ring: "group-hover:border-violet-500/50",
    from: "from-violet-500/20",
  },
  sky: {
    text: "text-sky-500",
    bg: "bg-sky-500/10",
    ring: "group-hover:border-sky-500/50",
    from: "from-sky-500/20",
  },
};

export function colorClasses(color: string) {
  return COLOR_CLASSES[color] ?? COLOR_CLASSES.emerald;
}
