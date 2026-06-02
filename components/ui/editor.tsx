"use client";

import React, { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const [isUploading, setIsUploading] = useState(false);

  const parsedInitial: PartialBlock[] | undefined = useMemo(() => {
    if (!initialContent) return undefined;

    try {
      const parsed = JSON.parse(initialContent);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      console.warn("Invalid initial content JSON");
      return undefined;
    }
  }, [initialContent]);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);

      const response = await edgestore.publicFiles.upload({
        file,
      });

      return response.url;
    } finally {
      setIsUploading(false);
    }
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: parsedInitial,
    uploadFile: handleUpload,
  });

  const handleChange = () => {
    try {
      const content = JSON.stringify(editor.document);
      onChange(content);
    } catch (err) {
      console.error("Failed to serialize editor content:", err);
    }
  };

  if (editor) {
    editor.isEditable = editable;
  }

  return (
    <div className="relative w-full">
      {/* Ambient Glow */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-violet-600/5 blur-3xl" />

      {/* Upload Indicator */}
      {isUploading && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-violet-500/20 bg-black/80 px-4 py-2 backdrop-blur-xl">
          <div className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
          <span className="text-sm text-violet-300">
            Uploading image...
          </span>
        </div>
      )}

      <div
        className="
          rounded-3xl
          border
          border-violet-500/20
          bg-black/60
          backdrop-blur-2xl
          shadow-[0_0_40px_rgba(139,92,246,0.15)]
          transition-all
          duration-300
        "
      >
        <BlockNoteView
          editor={editor}
          editable={editable}
          onChange={handleChange}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          className="
            min-h-[700px]
            px-6
            py-8
          "
        />
      </div>
    </div>
  );
};

export default Editor;