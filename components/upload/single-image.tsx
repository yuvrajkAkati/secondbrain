'use client';

import { cn } from '@/lib/utils';
import {
  AlertCircleIcon,
  Trash2Icon,
  UploadCloudIcon,
} from 'lucide-react';
import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { formatFileSize } from './uploader-provider'; // still fine to reuse helper if needed

const DROPZONE_VARIANTS = {
  base: 'relative rounded-md p-4 flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border-2 border-dashed border-muted-foreground transition-colors duration-200 ease-in-out',
  image: 'border-0 p-0 min-h-0 min-w-0 relative bg-muted shadow-md',
  active: 'border-primary',
  disabled:
    'bg-muted/50 border-muted-foreground/50 cursor-default pointer-events-none',
  accept: 'border-primary bg-primary/10',
  reject: 'border-destructive bg-destructive/10',
};

/**
 * Props for the SingleImageDropzone component.
 */
export interface SingleImageDropzoneProps {
  /** The width of the dropzone area in pixels. */
  width?: number;
  /** The height of the dropzone area in pixels. */
  height?: number;
  /** Whether the dropzone is disabled. */
  disabled?: boolean;
  /** Custom CSS class name. */
  className?: string;
  /** Called when an image file is dropped or selected. */
  onChange?: (file?: File) => void;
  /** Dropzone configuration. */
  dropzoneOptions?: Omit<
    DropzoneOptions,
    'disabled' | 'onDrop' | 'maxFiles' | 'multiple'
  >;
}

/**
 * A simple single-image upload component with preview and error handling.
 */
const SingleImageDropzone = React.forwardRef<
  HTMLInputElement,
  SingleImageDropzoneProps
>(
  (
    {
      dropzoneOptions,
      width,
      height,
      className,
      disabled,
      onChange,
    },
    ref,
  ) => {
    const [error, setError] = React.useState<string>();
    const [preview, setPreview] = React.useState<string | null>(null);

    const maxSize = dropzoneOptions?.maxSize;

    // 🧠 Setup dropzone
    const {
      getRootProps,
      getInputProps,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { 'image/*': [] },
      multiple: false,
      disabled,
      onDrop: (acceptedFiles, rejectedFiles) => {
        setError(undefined);

        if (rejectedFiles.length > 0) {
          const firstError = rejectedFiles[0]?.errors[0];
          if (firstError) {
            const messages: Record<string, string> = {
              'file-too-large': `File too large. Max size: ${formatFileSize(
                maxSize ?? 0,
              )}.`,
              'file-invalid-type': 'Invalid file type.',
              'too-many-files': 'You can only upload one image.',
              default: 'Unsupported file.',
            };
            setError(messages[firstError.code] ?? messages.default);
          }
          return;
        }

        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          const previewUrl = URL.createObjectURL(file);
          setPreview(previewUrl);
          onChange?.(file);
        }
      },
      ...dropzoneOptions,
    });

    const dropZoneClassName = React.useMemo(
      () =>
        cn(
          DROPZONE_VARIANTS.base,
          isFocused && DROPZONE_VARIANTS.active,
          disabled && DROPZONE_VARIANTS.disabled,
          preview && DROPZONE_VARIANTS.image,
          isDragReject && DROPZONE_VARIANTS.reject,
          isDragAccept && DROPZONE_VARIANTS.accept,
          className,
        ),
      [isFocused, disabled, preview, isDragAccept, isDragReject, className],
    );

    // 🧹 Clean up preview URL on unmount
    React.useEffect(() => {
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }, [preview]);

    return (
      <div className="flex flex-col items-center">
        <div
          {...getRootProps({
            className: dropZoneClassName,
            style: { width, height },
          })}
        >
          <input ref={ref} {...getInputProps()} />

          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    onChange?.(undefined);
                  }}
                  className="absolute top-2 right-2 bg-background/80 border border-muted-foreground rounded-full p-1 shadow-md hover:scale-110 transition"
                >
                  <Trash2Icon className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ) : (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground',
                disabled && 'opacity-50',
              )}
            >
              <UploadCloudIcon className="mb-1 h-7 w-7" />
              <div className="font-medium">
                Drag & drop an image or click to select
              </div>
              {maxSize && (
                <div className="text-xs">
                  Max size: {formatFileSize(maxSize)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ⚠️ Error message */}
        {error && (
          <div className="mt-2 flex items-center text-xs text-destructive">
            <AlertCircleIcon className="mr-1 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  },
);

SingleImageDropzone.displayName = 'SingleImageDropzone';

export { SingleImageDropzone };
