"use client";

import { isOrderedList } from "@platejs/list";
import { useTodoListElement, useTodoListElementState } from "@platejs/list/react";
import type { TListElement } from "platejs";
import { type PlateElementProps, type RenderNodeWrapper, useReadOnly } from "platejs/react";
import type React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const listItemConfig: Record<
  string,
  {
    Li: React.FC<PlateElementProps & { lineBreakBadge?: React.ReactNode }>;
    Marker: React.FC<PlateElementProps>;
  }
> = {
  todo: {
    Li: TodoLi,
    Marker: TodoMarker,
  },
};

export const BlockList: RenderNodeWrapper = (props) => {
  if (!props.element.listStyleType) return;
  if (!isOrderedList(props.element)) return;

  return (innerProps) => <List {...innerProps} />;
};

function List(props: PlateElementProps & { lineBreakBadge?: React.ReactNode }) {
  const { listStart, listStyleType } = props.element as TListElement;
  const itemConfig = listItemConfig[listStyleType as string];
  const ListTag = isOrderedList(props.element) ? "ol" : "ul";

  return (
    <ListTag
      className="relative m-0 p-0"
      style={{ listStyleType: listStyleType as string }}
      start={listStart as number | undefined}
    >
      {itemConfig?.Marker && <itemConfig.Marker {...props} />}
      {itemConfig?.Li ? (
        <itemConfig.Li {...props} />
      ) : (
        <li>
          {props.children}
          {props.lineBreakBadge}
        </li>
      )}
    </ListTag>
  );
}

function TodoMarker(props: PlateElementProps) {
  const state = useTodoListElementState({ element: props.element });
  const { checkboxProps } = useTodoListElement(state);
  const readOnly = useReadOnly();

  return (
    <div contentEditable={false}>
      <Checkbox
        className={cn("-left-6 absolute top-1", readOnly && "pointer-events-none")}
        {...checkboxProps}
      />
    </div>
  );
}

interface TodoLiProps extends PlateElementProps {
  lineBreakBadge?: React.ReactNode;
}

function TodoLi({ children, element, lineBreakBadge }: TodoLiProps) {
  return (
    <li
      className={cn(
        "list-none",
        (element.checked as boolean) && "text-muted-foreground line-through",
      )}
    >
      {children}
      {lineBreakBadge}
    </li>
  );
}
