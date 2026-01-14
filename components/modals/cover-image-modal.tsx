"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "../upload/single-image";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.document.update);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File | null>(null);

  const onClose = () => {
    setIsSubmitting(false);
    setFile(null);
    coverImage.onClose();
  };

  // ✅ Handle file upload manually
  const onChange = async (file?: File) => {
    if (!file) return;
    try {
      setIsSubmitting(true);
      setFile(file);      
      const res = await edgestore.publicFiles.upload({
        file,
        options : {
            replaceTargetUrl : coverImage.url
        },
        onProgressChange: (progress) => {
          // optional: you can log or display progress here
          console.log(`Upload progress: ${progress}%`);
        },
      });
      // Upload file to EdgeStore
      

      // Update document in Convex with uploaded URL
      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      // Close modal after successful upload
      onClose();
    } catch (error) {
      console.error("Error uploading cover image:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>

        {/* ✅ Pass manual file handler */}
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          onChange={onChange}
          width={400}
          height={200}
          dropzoneOptions={{
            maxSize: 5 * 1024 * 1024, // 5MB
          }}
        />

        {/* ✅ Optional progress indicator */}
        {isSubmitting && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Uploading...
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};


