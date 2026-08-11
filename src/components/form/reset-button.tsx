"use client";

import type * as React from "react";

import { Button } from "@/components/ui/button";

import { useFormContext } from "./widgets/context";

type ResetButtonProps = Omit<React.ComponentProps<typeof Button>, "type" | "onClick"> & {
  children: React.ReactNode;
};

export function ResetButton({ children, ...buttonProps }: ResetButtonProps) {
  const form = useFormContext();
  return (
    <Button type="button" variant="outline" onClick={() => form.reset()} {...buttonProps}>
      {children}
    </Button>
  );
}
