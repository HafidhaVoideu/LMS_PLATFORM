import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface EmptyStateProps {
  title: string;
  buttonText: string;
  description: string;
  href: string;
}
export function EmptyState({
  title,
  buttonText,
  description,
  href,
}: EmptyStateProps) {
  return (
    <div className="flex  flex-col flex-1 items-center justify-center h-full rounded-md border-dashed border p-8  mt-4 text-center animate-in  fade-in-50">
      <div className="flex justify-center items-center size-20 bg-primary/10 rounded-full">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mb-8 mt2 text-center text-sm leading-right text-muted-foreground">
        {description}
      </p>

      <Link href={href} className={buttonVariants({ size: "sm" })}>
        <PlusCircle className="mr-2 size-4 " /> {buttonText}
      </Link>
    </div>
  );
}
