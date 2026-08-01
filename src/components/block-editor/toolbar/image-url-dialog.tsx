"use client";

import * as React from "react";
import { isUrl } from "platejs";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface ImageUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string) => void;
}

/**
 * Dialog that asks for an image URL and reports it via onSubmit.
 */
export function ImageUrlDialog({ open, onOpenChange, onSubmit }: ImageUrlDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-6">
        <ImageUrlDialogContent onOpenChange={onOpenChange} onSubmit={onSubmit} />
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ImageUrlDialogContentProps {
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string) => void;
}

function ImageUrlDialogContent({ onOpenChange, onSubmit }: ImageUrlDialogContentProps) {
  const [url, setUrl] = React.useState("");

  const embedImage = React.useCallback(() => {
    if (!isUrl(url)) {
      toast.error("Invalid URL");
      return;
    }

    onOpenChange(false);
    onSubmit(url);
  }, [url, onOpenChange, onSubmit]);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Insert Image</AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogDescription className="group relative w-full">
        <label
          className="-translate-y-1/2 absolute top-1/2 block cursor-text px-1 text-muted-foreground/70 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:font-medium group-focus-within:text-foreground group-focus-within:text-xs has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground has-[+input:not(:placeholder-shown)]:text-xs"
          htmlFor="url"
        >
          <span className="inline-flex bg-background px-2">URL</span>
        </label>
        <Input
          id="url"
          className="w-full"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") embedImage();
          }}
          placeholder=""
          type="url"
          autoFocus
        />
      </AlertDialogDescription>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            embedImage();
          }}
        >
          Accept
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
