/**
 * Remark plugin: convert ```mermaid fenced code blocks into a
 * <Mermaid> MDX element so they render as live diagrams instead of
 * being syntax-highlighted as code.
 *
 * Runs in the mdast phase (after parsing), so injecting a text child
 * with arbitrary characters like `{}` is safe — it is never re-parsed.
 */
type AnyNode = {
  type: string;
  lang?: string;
  value?: string;
  children?: AnyNode[];
  [key: string]: unknown;
};

function walk(node: AnyNode) {
  if (!node || !Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "code" && child.lang === "mermaid") {
      node.children[i] = {
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [],
        children: [{ type: "text", value: child.value ?? "" }],
      };
    } else {
      walk(child);
    }
  }
}

export function remarkMermaid() {
  return (tree: AnyNode) => {
    walk(tree);
  };
}
