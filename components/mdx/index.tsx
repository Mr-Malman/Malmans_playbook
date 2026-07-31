import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { remarkMermaid } from "@/lib/remark-mermaid";

import { Pre } from "./code-block";
import { Mermaid } from "./mermaid";
import { AttackPath } from "./attack-path";
import { YouTube } from "./youtube";
import { PayloadBox } from "./payload-box";
import { Alert, DefenseNote, LabStep, Steps, CVEBadge } from "./callouts";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark-dimmed",
  keepBackground: false,
  defaultLang: "plaintext",
};

// Components exposed to MDX authors.
export const mdxComponents = {
  Mermaid,
  AttackPath,
  YouTube,
  PayloadBox,
  Alert,
  DefenseNote,
  LabStep,
  Steps,
  CVEBadge,
  pre: Pre,
};

// MDXRemote (rsc) is an async Server Component; cast to a plain FC so it
// type-checks as JSX regardless of the ambient async-component typings.
const MDXRemoteRSC = MDXRemote as unknown as React.FC<
  React.ComponentProps<typeof MDXRemote>
>;

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemoteRSC
      source={source}
      components={mdxComponents}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMermaid],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
        },
      }}
    />
  );
}
