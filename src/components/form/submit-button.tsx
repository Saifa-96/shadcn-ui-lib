"use client";

import type * as React from "react";

import { Button } from "@/components/ui/button";

import { useFormContext } from "./widgets/context";

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, "type"> & {
  children: React.ReactNode;
  pendingLabel?: React.ReactNode;
};

export function SubmitButton({ children, pendingLabel, ...buttonProps }: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} {...buttonProps}>
          {isSubmitting ? (pendingLabel ?? children) : children}
        </Button>
      )}
    </form.Subscribe>
  );
}
