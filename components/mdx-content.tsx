"use client";

import * as runtime from "react/jsx-runtime";
import { useMDXComponents } from "./mdx-components";

/**
 * Renders Velite-compiled MDX code.
 * The code string comes from Velite's build-time MDX compilation (trusted, not user input).
 */
function getMDXComponent(code: string) {
  // Velite compiles MDX to a module-like function at build time.
  // This is the standard pattern from Velite's documentation.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(code); // SAFE: code is from Velite build output, not user input
  return fn({ ...runtime }).default;
}

export function MDXContent({ code }: { code: string }) {
  const Component = getMDXComponent(code);
  const components = useMDXComponents({});
  return <Component components={components} />;
}
