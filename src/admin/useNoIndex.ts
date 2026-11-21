import { useEffect } from "react";

/**
 * Enforces noindex, nofollow metadata in the document head while any private admin route is active.
 */
export function useNoIndex(title: string): void {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const existed = Boolean(meta);
    const prevContent = meta?.getAttribute("content") ?? "";

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow, noarchive");

    return () => {
      document.title = prevTitle;
      if (meta) {
        if (existed) {
          meta.setAttribute("content", prevContent);
        } else {
          meta.remove();
        }
      }
    };
  }, [title]);
}
