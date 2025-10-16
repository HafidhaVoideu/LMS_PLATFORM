"use client";

import { useMemo } from "react";

import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/react";
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
