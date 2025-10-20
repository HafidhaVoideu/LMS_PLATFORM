"use client";

import parse from "html-react-parser";

export default function RenderDescription({ html }: { html: string }) {
  // const output = useMemo(() => {
  //   return generateHTML(json, [
  //     StarterKit,
  //     TextAlign.configure({
  //       types: ["heading", "paragraph"],
  //     }),
  //   ]);
  // }, [json]);

  return (
    <div className="prose prose-invert prose-li:marker:text-primary">
      {parse(html)}
    </div>
  );
}
