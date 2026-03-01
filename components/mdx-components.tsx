import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    img: ({ src, alt, ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt || ""} className="rounded-lg" {...props} />
    ),
    pre: ({ children, ...props }) => (
      <pre className="overflow-x-auto rounded-lg" {...props}>
        {children}
      </pre>
    ),
  };
}
