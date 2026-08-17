import type { DefaultTreeAdapterMap } from "parse5";
import { parse, serialize } from "parse5";

import bentoHtml from "./bento/Bento_Slides.bento.html?raw";
import debrandCss from "./debrand.css?raw";
import scrollbarCss from "./scrollbar.css?raw";

const EDITOR_TITLE = "Slides";

/**
 * Inject extra stylesheets into the shell's <head> and strip the bento brand
 * from the boot-time <title>.
 *
 * Done once at module load, inside the HTML string itself — so the iframe's
 * first paint already carries the styles (no append-after-render flicker).
 * Parsing the shell and serializing it back is a one-time ~30ms cost per load;
 * if that ever becomes a problem, move this to a build-time step instead.
 */
export const BENTO_HTML: string = injectStyles(bentoHtml, [
  { id: "scrollbar", css: scrollbarCss },
  { id: "debrand", css: debrandCss },
]);

function injectStyles(html: string, styles: Array<{ id: string; css: string }>): string {
  const document = parse(html);
  const head = findHead(document);
  if (!head) {
    return html;
  }

  const styleNodes = styles.map(({ id, css }) => ({
    nodeName: "style",
    tagName: "style",
    attrs: [{ name: "data-ppt-editor", value: id }],
    namespaceURI: "http://www.w3.org/1999/xhtml",
    parentNode: head,
    childNodes: [
      {
        nodeName: "#text",
        value: css,
        parentNode: head,
      },
    ],
  }));

  const headChildren = head.childNodes ?? [];
  headChildren.push(...(styleNodes as never[]));
  head.childNodes = headChildren;

  replaceTitle(head, EDITOR_TITLE);

  return serialize(document);
}

/**
 * Rewrite the shell's static <title> (shown on the browser tab during the
 * boot splash, before the runtime sets document.title).
 */
function replaceTitle(head: HeadElement, title: string): void {
  for (const child of head.childNodes) {
    const element = child as NodeLike;
    if (element.tagName === "title") {
      element.childNodes = [{ nodeName: "#text", value: title, parentNode: child } as never];
      return;
    }
  }
}

function findHead(node: NodeLike): HeadElement | null {
  if (node.tagName === "head") {
    return node as HeadElement;
  }
  for (const child of node.childNodes ?? []) {
    const found = findHead(child as NodeLike);
    if (found) {
      return found;
    }
  }
  return null;
}

type NodeLike = DefaultTreeAdapterMap["node"] & {
  tagName?: string;
  childNodes?: DefaultTreeAdapterMap["node"][];
};

type HeadElement = NodeLike & {
  childNodes: DefaultTreeAdapterMap["node"][];
};
