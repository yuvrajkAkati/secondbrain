"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "./button";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable = true }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const {edgestore} = useEdgeStore()

  const handleUpload = async(file : File) => {
    const response = await edgestore.publicFiles.upload({
        file
    })
    return response.url;
  }
  // ✅ Safely parse initial content
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

  // ✅ Create editor instance
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: parsedInitial,
    uploadFile : handleUpload
  });

  // ✅ Modern change handler
  const handleChange = () => {
    try {
      // latest BlockNote exposes .document which holds live content
      const content = JSON.stringify(editor.document, null, 2);
      onChange(content);
    } catch (err) {
      console.error("Failed to serialize editor content:", err);
    }
  };

  // ✅ Dynamically toggle edit mode (official pattern)
  if (editor && typeof editable === "boolean") {
    editor.isEditable = editable;
  }

  return (
    <div className="w-full">
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={handleChange}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
    </div>
  );
};

export default Editor;
