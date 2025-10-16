import { cn } from "@/lib/utils";
import { CloudUploadIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";

import { ImageIcon } from "lucide-react";

import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>

      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="font-bold text-primary cursor-pointer">
          click to upload
        </span>
      </p>

      <Button type="button" className="mt-4">
        {" "}
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState({}) {
  return (
    <div className="text-destructive text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className="size-6 text-destructive " />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>

      <p className="text-xs mt-1 text-muted-foreground">Somthing Went Wrong</p>

      <Button type="button" className="mt-4">
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploaedState({
  previewURL,
  fileType,
  handleRemoveFile,

  isDeleting,
}: {
  fileType: "image" | "video";
  previewURL: string;
  handleRemoveFile: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="h-full w-full  max-w-[700px] flex items-center   justify-center relative mx-auto">
      {fileType == "video" ? (
        <video
          src={previewURL}
          controls
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <Image src={previewURL} alt="preview" fill className="object-cover" />
      )}

      <Button
        onClick={handleRemoveFile}
        size="icon"
        type="button"
        variant="destructive"
        className={cn("absolute top-0 right-0")}
      >
        {isDeleting ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          <XIcon size={4} />
        )}
      </Button>
    </div>
  );
}

export function RenderUploafingState({
  file,
  progress,
}: {
  file: File;
  progress: number;
}) {
  return (
    <div className="text-center flex flex-col justify-center items-center">
      <p>{progress}</p>
      <p className="mt-2 text-sm text-foreground font-medium">Uploading...</p>

      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
