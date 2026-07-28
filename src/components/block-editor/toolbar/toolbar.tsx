import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { type VariantProps, cva } from "class-variance-authority";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function Toolbar({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      className={cn("relative flex select-none items-center", className)}
      {...props}
    />
  );
}

export function ToolbarToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToolbarToggleGroup>) {
  return (
    <ToolbarPrimitive.ToolbarToggleGroup
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export function ToolbarToggleItem({
  className,
  size = "sm",
  variant,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem> &
  VariantProps<typeof toolbarButtonVariants>) {
  return (
    <ToolbarPrimitive.ToggleItem
      className={cn(toolbarButtonVariants({ size, variant }), className)}
      {...props}
    />
  );
}

const toolbarButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[color,box-shadow] hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-checked:bg-accent aria-checked:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "sm",
      variant: "default",
    },
    variants: {
      size: {
        sm: "h-8 min-w-8 px-1.5",
        default: "h-9 min-w-9 px-2",
      },
      variant: {
        default: "bg-transparent",
      },
    },
  }
);

interface ToolbarButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToolbarToggleItem>, "asChild" | "value">,
    VariantProps<typeof toolbarButtonVariants> {
  pressed?: boolean;
  tooltip?: React.ReactNode;
}

export function ToolbarButton({
  children,
  className,
  pressed,
  size = "sm",
  tooltip,
  variant,
  ...props
}: ToolbarButtonProps) {
  const button =
    typeof pressed === "boolean" ? (
      <ToolbarToggleGroup disabled={props.disabled} value="single" type="single">
        <ToolbarToggleItem
          className={cn(toolbarButtonVariants({ size, variant }), className)}
          value={pressed ? "single" : ""}
          {...props}
        >
          {children}
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
    ) : (
      <ToolbarPrimitive.Button
        className={cn(toolbarButtonVariants({ size, variant }), className)}
        {...props}
      >
        {children}
      </ToolbarPrimitive.Button>
    );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

export function ToolbarGroup({
  children,
  className,
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/toolbar-group",
        "relative hidden has-[button]:flex",
        className
      )}
    >
      <div className="flex items-center">{children}</div>
      <div className="group-last/toolbar-group:hidden! mx-1.5 py-0.5">
        <Separator orientation="vertical" />
      </div>
    </div>
  );
}
