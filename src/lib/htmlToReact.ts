import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

export function htmlToReact(htmlString: string) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      createElement: React.createElement,
      Fragment,
      jsx,
      jsxs,
    })
    .processSync(htmlString).result;
}
