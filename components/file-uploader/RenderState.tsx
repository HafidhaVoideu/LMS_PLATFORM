import { cn } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";
import { Button } from "../ui/button";

import { ImageIcon } from "lucide-react";

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

      <Button className="mt-4">Retry File Selection</Button>
    </div>
  );
}
