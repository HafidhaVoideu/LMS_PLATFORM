"use client";

import { useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "./Menubar";

import { EditorContent } from "@tiptap/react";
export default function RichTextEditor({ field }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose-md lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-inout/30">
      <MenuBar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
}
