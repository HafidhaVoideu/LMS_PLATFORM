"use client";
import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Card, CardContent } from "../ui/card";

import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";

interface UploaderType {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleteing: boolean;
  error: boolean;
  objectURL?: string;
  fileType: "image" | "video";
}
export default function Uploader() {
  const [fileState, setFileState] = useState<UploaderType>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleteing: false,
    error: false,
    fileType: "image",
  });

  function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
    } catch {}
  }
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        error: false,
        fileType: "image",
        isDeleteing: false,
        id: uuidv4(),
      });
    }
  }, []);

  function rejectedFilesHandler(fileRejection: FileRejection[]) {
    const tooManyFiles = fileRejection.find(
      (rejection) => rejection.errors[0].code === "too-many-files"
    );

    const filesize = fileRejection.find(
      (rejection) => rejection.errors[0].code === "file-too-large"
    );

    if (filesize) toast.error("File size must be less than 5MB");
    if (tooManyFiles) toast.error("You can only upload one file at a time");
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,

    onDropRejected: rejectedFilesHandler,
  });
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "rleative border-2 border-dashed  transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border  hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4 ">
        <input {...getInputProps()} />

        <RenderEmptyState isDragActive={isDragActive} />

        {/* <RenderErrorState></RenderErrorState> */}
      </CardContent>
    </Card>
  );
}
