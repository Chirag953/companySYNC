"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type FileUploadProps = {
  accept?: string;
  maxSizeMB?: number;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
};

export function FileUpload({
  accept = ".pdf,.png,.jpg,.jpeg,.doc,.docx",
  maxSizeMB = 10,
  onFilesSelected,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      const files = Array.from(list);
      onFilesSelected?.(files);
    },
    [onFilesSelected],
  );

  return (
    <div
      className={cn(
        "flex min-h-[11rem] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-6 text-center transition-colors",
        isDragging && "border-primary bg-primary/5",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <Upload className="mb-2 size-8 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium">Drag and drop files here</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Accepted: {accept.replaceAll(",", ", ")} — max {maxSizeMB} MB (mock)
      </p>
      <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Browse files
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
