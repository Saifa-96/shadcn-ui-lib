import { PlateElement, type PlateElementProps } from "platejs/react";

import { cn } from "@/lib/utils";

export const H1Element: React.FC<PlateElementProps> = ({ className, ...props }) => {
  return (
    <PlateElement
      as="h1"
      className={cn("text-3xl font-bold tracking-tight", className)}
      {...props}
    />
  );
};

export const H2Element: React.FC<PlateElementProps> = ({ className, ...props }) => {
  return (
    <PlateElement
      as="h2"
      className={cn("text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
};

export const H3Element: React.FC<PlateElementProps> = ({ className, ...props }) => {
  return (
    <PlateElement
      as="h3"
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
};
