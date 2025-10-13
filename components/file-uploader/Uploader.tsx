"use client";
import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";

import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploaedState,
  RenderUploafingState,
} from "./RenderState";
import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct-url";

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

interface UploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}
export default function Uploader({ value, onChange }: UploaderProps) {
  const fileName = useConstructUrl(value || "");
  const [fileState, setFileState] = useState<UploaderType>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleteing: false,
    error: false,
    fileType: "image",
    key: value,
    objectURL: fileName,
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      console.log("presignedResponse", presignedResponse);

      if (!presignedResponse.ok) {
        toast.error("error fetching presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // listen for  file progress

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(progress),
            }));
          } else {
            toast.error("Error uploading file. length not computable");
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 0,
              error: true,
            }));
          }
        };

        // listen for file upload

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              key,
            }));

            onChange?.(key);

            toast.success("File uploaded successfully");
            resolve();
          } else {
            toast.error("Error uploading file");
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 0,
              error: true,
            }));

            reject(new Error("Error uploading file"));
          }
        };

        //error on file upload
        xhr.onerror = () => {
          toast.error("Error uploading file before catching error");
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));

          reject(new Error("Error uploading file"));
        };
        console.log("before putting");

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (e) {
      toast.error("Error uploading file");

      setFileState((prev) => ({
        ...prev,
        uploading: false,
        error: true,
      }));
    }
  }
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectURL && !fileState.objectURL?.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectURL);
        }
        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          error: false,
          fileType: "image",
          isDeleteing: false,
          objectURL: URL.createObjectURL(file),
          id: uuidv4(),
        });
        uploadFile(file);
      }
    },
    [fileState.objectURL]
  );

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

  async function handleDeleteFile() {
    if (fileState.isDeleteing || !fileState.objectURL) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleteing: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Error deleting file");
        setFileState((prev) => ({
          ...prev,
          isDeleteing: false,
          error: true,
        }));

        return;
      }

      if (fileState.objectURL && !fileState.objectURL?.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectURL);
      }

      onChange?.("");

      setFileState((prev) => ({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleteing: false,
        error: false,
        fileType: "image",
        objectURL: undefined,
      }));

      toast.success("File deleted successfully");
    } catch (e) {
      toast.error("Error deleting file");
      setFileState((prev) => ({
        ...prev,
        isDeleteing: false,
        error: true,
      }));
    }
  }
  function renderFileState() {
    if (fileState.uploading)
      return (
        <RenderUploafingState
          file={fileState.file!}
          progress={fileState.progress}
        ></RenderUploafingState>
      );

    if (fileState.error) return <RenderErrorState></RenderErrorState>;

    if (fileState.objectURL)
      return (
        <RenderUploaedState
          handleRemoveFile={handleDeleteFile}
          isDeleting={fileState.isDeleteing}
          previewURL={fileState.objectURL}
        />
      );

    return <RenderEmptyState isDragActive={isDragActive}></RenderEmptyState>;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectURL && !fileState.objectURL?.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectURL);
      }
    };
  }, [fileState.objectURL]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,

    onDropRejected: rejectedFilesHandler,

    disabled: fileState.uploading || !!fileState.objectURL,
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
      <CardContent className="flex items-center justify-center h-full w-full  ">
        <input {...getInputProps()} />

        {renderFileState()}
        {/* <RenderEmptyState isDragActive={isDragActive} /> */}

        {/* <RenderErrorState></RenderErrorState> */}
      </CardContent>
    </Card>
  );
}
