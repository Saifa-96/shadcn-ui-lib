import { useDraggable, useDropLine } from "@platejs/dnd";
import { resizeLengthClampStatic } from "@platejs/resizable";
import { BlockSelectionPlugin, useBlockSelected } from "@platejs/selection/react";
import {
  getTableColumnCount,
  setTableColSize,
  setTableMarginLeft,
  setTableRowSize,
} from "@platejs/table";
import {
  roundCellSizeToStep,
  TablePlugin,
  TableProvider,
  useCellIndices,
  useOverrideColSize,
  useOverrideMarginLeft,
  useOverrideRowSize,
  useTableCellBorders,
  useTableColSizes,
  useTableElement,
  useTableSelectionDom,
  useTableValue,
} from "@platejs/table/react";
import { GripVertical } from "lucide-react";
import {
  KEYS,
  PathApi,
  type TElement,
  type TTableCellElement,
  type TTableElement,
  type TTableRowElement,
} from "platejs";
import {
  PlateElement,
  type PlateElementProps,
  useComposedRef,
  useEditorPlugin,
  useEditorRef,
  useElement,
  useElementSelector,
  usePluginOption,
  useReadOnly,
  withHOC,
} from "platejs/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableFloatingToolbar } from "../toolbar/table-floating-toolbar";

// ─── Constants ───────────────────────────────────────────────────────────────

const TABLE_CONTROL_COLUMN_WIDTH = 8;
const TABLE_DEFAULT_COLUMN_WIDTH = 120;

// ─── Resize Context ──────────────────────────────────────────────────────────

type TableResizeDirection = "bottom" | "left" | "right";

interface TableResizeStartOptions {
  colIndex: number;
  direction: TableResizeDirection;
  handleKey: string;
  rowIndex: number;
}

interface TableResizeDragState {
  colIndex: number;
  direction: TableResizeDirection;
  initialPosition: number;
  initialSize: number;
  marginLeft: number;
  rowIndex: number;
}

interface TableResizeContextValue {
  disableMarginLeft: boolean;
  clearResizePreview: (handleKey: string) => void;
  setResizePreview: (
    event: React.PointerEvent<HTMLDivElement>,
    options: TableResizeStartOptions,
  ) => void;
  startResize: (
    event: React.PointerEvent<HTMLDivElement>,
    options: TableResizeStartOptions,
  ) => void;
}

const TableResizeContext = React.createContext<TableResizeContextValue | null>(null);

function useTableResizeContext() {
  const context = React.useContext(TableResizeContext);
  if (!context) throw new Error("TableResizeContext is missing");
  return context;
}

// ─── Resize Controller ───────────────────────────────────────────────────────

interface ResizeControllerOptions {
  controlColumnWidth: number;
  dragIndicatorRef: React.RefObject<HTMLDivElement | null>;
  hoverIndicatorRef: React.RefObject<HTMLDivElement | null>;
  marginLeft: number;
  tablePath: number[];
  tableRef: React.RefObject<HTMLTableElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function useTableResizeController({
  controlColumnWidth,
  dragIndicatorRef,
  hoverIndicatorRef,
  marginLeft,
  tablePath,
  tableRef,
  wrapperRef,
}: ResizeControllerOptions) {
  const { editor, getOptions } = useEditorPlugin(TablePlugin);
  const { disableMarginLeft = false, minColumnWidth = 0 } = getOptions();
  const colSizes = useTableColSizes({ disableOverrides: true });

  const effectiveColSizes = React.useMemo(
    () => colSizes.map((colSize) => colSize || TABLE_DEFAULT_COLUMN_WIDTH),
    [colSizes],
  );
  const effectiveColSizesRef = React.useRef(effectiveColSizes);
  const activeHandleKeyRef = React.useRef<string | null>(null);
  const cleanupListenersRef = React.useRef<(() => void) | null>(null);
  const marginLeftRef = React.useRef(marginLeft);
  const dragStateRef = React.useRef<TableResizeDragState | null>(null);
  const frozenRowIndicesRef = React.useRef<number[] | null>(null);
  const previewHandleKeyRef = React.useRef<string | null>(null);
  const overrideColSize = useOverrideColSize();
  const overrideMarginLeft = useOverrideMarginLeft();
  const overrideRowSize = useOverrideRowSize();

  React.useEffect(() => {
    effectiveColSizesRef.current = effectiveColSizes;
  }, [effectiveColSizes]);
  React.useEffect(() => {
    marginLeftRef.current = marginLeft;
  }, [marginLeft]);

  const hideDragIndicator = React.useCallback(() => {
    const el = dragIndicatorRef.current;
    if (!el) return;
    el.style.display = "none";
    el.style.removeProperty("left");
  }, [dragIndicatorRef]);

  const _showDragIndicator = React.useCallback(
    (offset: number) => {
      const el = dragIndicatorRef.current;
      if (!el) return;
      el.style.display = "block";
      el.style.left = `${offset}px`;
    },
    [dragIndicatorRef],
  );

  const hideHoverIndicator = React.useCallback(() => {
    const el = hoverIndicatorRef.current;
    if (!el) return;
    el.style.display = "none";
    el.style.removeProperty("left");
  }, [hoverIndicatorRef]);

  const showHoverIndicatorAt = React.useCallback(
    (offset: number) => {
      const el = hoverIndicatorRef.current;
      if (!el) return;
      el.style.display = "block";
      el.style.left = `${offset}px`;
    },
    [hoverIndicatorRef],
  );

  const clearFrozenRowHeights = React.useCallback(() => {
    const indices = frozenRowIndicesRef.current;
    if (!indices) return;
    frozenRowIndicesRef.current = null;
    indices.forEach((i) => {
      overrideRowSize(i, null);
    });
  }, [overrideRowSize]);

  const freezeRowHeights = React.useCallback(() => {
    const table = tableRef.current;
    if (!table) return;
    clearFrozenRowHeights();
    const frozen: number[] = [];
    Array.from(table.rows).forEach((row, i) => {
      const h = row.getBoundingClientRect().height;
      if (!h) return;
      overrideRowSize(i, h);
      frozen.push(i);
    });
    frozenRowIndicesRef.current = frozen;
  }, [clearFrozenRowHeights, overrideRowSize, tableRef]);

  const showResizeIndicator = React.useCallback(
    ({
      event,
      direction,
    }: {
      event: React.PointerEvent<HTMLDivElement>;
      direction: TableResizeDirection;
    }) => {
      if (direction === "bottom") return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const handleRect = event.currentTarget.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      showHoverIndicatorAt(handleRect.left - wrapperRect.left + handleRect.width / 2);
    },
    [showHoverIndicatorAt, wrapperRef],
  );

  const setResizePreview = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>, options: TableResizeStartOptions) => {
      if (activeHandleKeyRef.current) return;
      previewHandleKeyRef.current = options.handleKey;
      showResizeIndicator({ event, direction: options.direction });
    },
    [showResizeIndicator],
  );

  const clearResizePreview = React.useCallback(
    (handleKey: string) => {
      if (activeHandleKeyRef.current) return;
      if (previewHandleKeyRef.current !== handleKey) return;
      previewHandleKeyRef.current = null;
      hideHoverIndicator();
    },
    [hideHoverIndicator],
  );

  const commitColSize = React.useCallback(
    (colIndex: number, width: number) => {
      setTableColSize(editor, { colIndex, width }, { at: tablePath });
      setTimeout(() => overrideColSize(colIndex, null), 0);
    },
    [editor, overrideColSize, tablePath],
  );

  const commitRowSize = React.useCallback(
    (rowIndex: number, height: number) => {
      setTableRowSize(editor, { height, rowIndex }, { at: tablePath });
      setTimeout(() => overrideRowSize(rowIndex, null), 0);
    },
    [editor, overrideRowSize, tablePath],
  );

  const commitMarginLeft = React.useCallback(
    (nextMarginLeft: number) => {
      setTableMarginLeft(editor, { marginLeft: nextMarginLeft }, { at: tablePath });
      setTimeout(() => overrideMarginLeft(null), 0);
    },
    [editor, overrideMarginLeft, tablePath],
  );

  const getColumnBoundaryOffset = React.useCallback(
    (colIndex: number, currentWidth: number) =>
      controlColumnWidth +
      effectiveColSizesRef.current.slice(0, colIndex).reduce((t, s) => t + s, 0) +
      currentWidth,
    [controlColumnWidth],
  );

  const applyResize = React.useCallback(
    (event: PointerEvent, finished: boolean) => {
      const state = dragStateRef.current;
      if (!state) return;
      const pos = state.direction === "bottom" ? event.clientY : event.clientX;
      const delta = pos - state.initialPosition;

      if (state.direction === "bottom") {
        const h = roundCellSizeToStep(state.initialSize + delta, undefined);
        if (finished) commitRowSize(state.rowIndex, h);
        else overrideRowSize(state.rowIndex, h);
        return;
      }

      if (state.direction === "left") {
        const initial = effectiveColSizesRef.current[state.colIndex] ?? state.initialSize;
        const complement = (w: number) => initial + state.marginLeft - w;
        const nextML = roundCellSizeToStep(
          resizeLengthClampStatic(state.marginLeft + delta, {
            max: complement(minColumnWidth),
            min: 0,
          }),
          undefined,
        );
        const nextW = complement(nextML);
        if (finished) {
          commitMarginLeft(nextML);
          commitColSize(state.colIndex, nextW);
        } else {
          showHoverIndicatorAt(controlColumnWidth + (nextML - state.marginLeft));
          overrideMarginLeft(nextML);
          overrideColSize(state.colIndex, nextW);
        }
        return;
      }

      // right
      const currentInitial = effectiveColSizesRef.current[state.colIndex] ?? state.initialSize;
      const nextInitial = effectiveColSizesRef.current[state.colIndex + 1];
      const complement = (w: number) => currentInitial + (nextInitial ?? 0) - w;
      const currentWidth = roundCellSizeToStep(
        resizeLengthClampStatic(currentInitial + delta, {
          max: nextInitial ? complement(minColumnWidth) : undefined,
          min: minColumnWidth,
        }),
        undefined,
      );
      const nextWidth = nextInitial ? complement(currentWidth) : undefined;

      if (finished) {
        commitColSize(state.colIndex, currentWidth);
        if (nextWidth !== undefined) commitColSize(state.colIndex + 1, nextWidth);
      } else {
        showHoverIndicatorAt(getColumnBoundaryOffset(state.colIndex, currentWidth));
        overrideColSize(state.colIndex, currentWidth);
        if (nextWidth !== undefined) overrideColSize(state.colIndex + 1, nextWidth);
      }
    },
    [
      commitColSize,
      commitMarginLeft,
      commitRowSize,
      controlColumnWidth,
      getColumnBoundaryOffset,
      showHoverIndicatorAt,
      minColumnWidth,
      overrideColSize,
      overrideMarginLeft,
      overrideRowSize,
    ],
  );

  const stopResize = React.useCallback(() => {
    cleanupListenersRef.current?.();
    cleanupListenersRef.current = null;
    activeHandleKeyRef.current = null;
    previewHandleKeyRef.current = null;
    dragStateRef.current = null;
    hideDragIndicator();
    hideHoverIndicator();
    clearFrozenRowHeights();
  }, [clearFrozenRowHeights, hideDragIndicator, hideHoverIndicator]);

  React.useEffect(() => stopResize, [stopResize]);

  const startResize = React.useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
      { colIndex, direction, handleKey, rowIndex }: TableResizeStartOptions,
    ) => {
      const rowHeight = tableRef.current?.rows.item(rowIndex)?.getBoundingClientRect().height ?? 0;
      dragStateRef.current = {
        colIndex,
        direction,
        initialPosition: direction === "bottom" ? event.clientY : event.clientX,
        initialSize:
          direction === "bottom"
            ? rowHeight
            : (effectiveColSizesRef.current[colIndex] ?? TABLE_DEFAULT_COLUMN_WIDTH),
        marginLeft: marginLeftRef.current,
        rowIndex,
      };
      activeHandleKeyRef.current = handleKey;
      previewHandleKeyRef.current = null;

      cleanupListenersRef.current?.();

      if (direction !== "bottom") freezeRowHeights();

      const onMove = (e: PointerEvent) => applyResize(e, false);
      const onEnd = (e: PointerEvent) => {
        applyResize(e, true);
        stopResize();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);

      cleanupListenersRef.current = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
      };

      showResizeIndicator({ direction, event });
      event.preventDefault();
      event.stopPropagation();
    },
    [applyResize, freezeRowHeights, showResizeIndicator, stopResize, tableRef],
  );

  return React.useMemo(
    () => ({ clearResizePreview, disableMarginLeft, setResizePreview, startResize }),
    [clearResizePreview, disableMarginLeft, setResizePreview, startResize],
  );
}

// ─── TableElement ────────────────────────────────────────────────────────────

export const TableElement = withHOC(
  TableProvider,
  function TableElementInner({ children, ...props }: PlateElementProps<TTableElement>) {
    const readOnly = useReadOnly();
    const isSelectionAreaVisible = usePluginOption(BlockSelectionPlugin, "isSelectionAreaVisible");
    const hasControls = !readOnly && !isSelectionAreaVisible;
    const { marginLeft, props: tableProps } = useTableElement();
    const colSizes = useTableColSizes();
    const controlColumnWidth = hasControls ? TABLE_CONTROL_COLUMN_WIDTH : 0;
    const dragIndicatorRef = React.useRef<HTMLDivElement>(null);
    const hoverIndicatorRef = React.useRef<HTMLDivElement>(null);
    const tablePath = useElementSelector(([, path]) => path, [], { key: KEYS.table });
    const tableRef = React.useRef<HTMLTableElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    useTableSelectionDom(tableRef);

    const resizeController = useTableResizeController({
      controlColumnWidth,
      dragIndicatorRef,
      hoverIndicatorRef,
      marginLeft,
      tablePath,
      tableRef,
      wrapperRef,
    });

    const resolvedColSizes = React.useMemo(() => {
      if (colSizes.length > 0) {
        return colSizes.map((s) => s || TABLE_DEFAULT_COLUMN_WIDTH);
      }
      return Array.from(
        { length: getTableColumnCount(props.element) },
        () => TABLE_DEFAULT_COLUMN_WIDTH,
      );
    }, [colSizes, props.element]);

    const tableVariableStyle = React.useMemo(() => {
      if (resolvedColSizes.length === 0) return;
      return Object.fromEntries(
        resolvedColSizes.map((s, i) => [`--table-col-${i}`, `${s}px`]),
      ) as React.CSSProperties;
    }, [resolvedColSizes]);

    const tableStyle = React.useMemo(
      () =>
        ({
          width: `${resolvedColSizes.reduce((t, s) => t + s, 0) + controlColumnWidth}px`,
        }) as React.CSSProperties,
      [controlColumnWidth, resolvedColSizes],
    );

    const isSelectingTable = useBlockSelected(props.element.id as string);

    const content = (
      <PlateElement
        {...props}
        className={cn("overflow-x-auto py-5", hasControls && "-ml-2")}
        style={{ paddingLeft: marginLeft }}
      >
        <TableResizeContext.Provider value={resizeController}>
          <div ref={wrapperRef} className="group/table relative w-fit" style={tableVariableStyle}>
            <div
              ref={dragIndicatorRef}
              className="-translate-x-[1.5px] pointer-events-none absolute inset-y-0 z-36 hidden w-[3px] bg-ring/70"
              contentEditable={false}
            />
            <div
              ref={hoverIndicatorRef}
              className="-translate-x-[1.5px] pointer-events-none absolute inset-y-0 z-35 hidden w-[3px] bg-ring/80"
              contentEditable={false}
            />
            <table
              ref={tableRef}
              className={cn(
                "mr-0 ml-px table h-px table-fixed border-collapse",
                "data-[table-selecting=true]:[&_*::selection]:!bg-transparent",
                "data-[table-selecting=true]:[&_*::selection]:!text-inherit",
                "data-[table-selecting=true]:[&_*]:!caret-transparent",
              )}
              style={tableStyle}
              {...tableProps}
            >
              {resolvedColSizes.length > 0 && (
                <colgroup>
                  {hasControls && (
                    <col
                      style={{
                        maxWidth: TABLE_CONTROL_COLUMN_WIDTH,
                        minWidth: TABLE_CONTROL_COLUMN_WIDTH,
                        width: TABLE_CONTROL_COLUMN_WIDTH,
                      }}
                    />
                  )}
                  {resolvedColSizes.map((colSize, index) => (
                    <col
                      key={index}
                      style={{ maxWidth: colSize, minWidth: colSize, width: colSize }}
                    />
                  ))}
                </colgroup>
              )}
              <tbody className="min-w-full">{children}</tbody>
            </table>

            {isSelectingTable && (
              <div
                className="pointer-events-none absolute inset-0 z-1 bg-primary/[.13]"
                contentEditable={false}
              />
            )}
          </div>
        </TableResizeContext.Provider>
      </PlateElement>
    );

    if (readOnly) return content;

    return <TableFloatingToolbar>{content}</TableFloatingToolbar>;
  },
);

// ─── TableRowElement ─────────────────────────────────────────────────────────

export function TableRowElement({ children, ...props }: PlateElementProps<TTableRowElement>) {
  const { element } = props;
  const readOnly = useReadOnly();
  const editor = useEditorRef();
  const rowIndex = useElementSelector(([, path]) => path.at(-1) as number, [], { key: KEYS.tr });
  const rowSize = useElementSelector(([node]) => (node as TTableRowElement).size, [], {
    key: KEYS.tr,
  });
  const rowSizeOverrides = useTableValue("rowSizeOverrides");
  const rowMinHeight = rowSizeOverrides.get?.(rowIndex) ?? rowSize;
  const isSelectionAreaVisible = usePluginOption(BlockSelectionPlugin, "isSelectionAreaVisible");
  const hasControls = !readOnly && !isSelectionAreaVisible;

  const { isDragging, nodeRef, previewRef, handleRef } = useDraggable({
    element,
    type: element.type,
    canDropNode: ({ dragEntry, dropEntry }) =>
      PathApi.equals(PathApi.parent(dragEntry[1]), PathApi.parent(dropEntry[1])),
    onDropHandler: (_, { dragItem }) => {
      const dragElement = (dragItem as { element: TElement }).element;
      if (dragElement) editor.tf.select(dragElement);
    },
  });

  return (
    <PlateElement
      {...props}
      ref={useComposedRef(props.ref, previewRef, nodeRef)}
      as="tr"
      className={cn("group/row", isDragging && "opacity-50")}
      style={
        {
          ...props.style,
          "--tableRowMinHeight": rowMinHeight ? `${rowMinHeight}px` : undefined,
        } as React.CSSProperties
      }
    >
      {hasControls && (
        <td className="w-2 min-w-2 max-w-2 select-none p-0" contentEditable={false}>
          <RowDragHandle dragRef={handleRef} />
          <RowDropLine />
        </td>
      )}
      {children}
    </PlateElement>
  );
}

function RowDragHandle({ dragRef }: { dragRef: React.Ref<HTMLElement> }) {
  const editor = useEditorRef();
  const element = useElement();

  return (
    <Button
      ref={dragRef as React.Ref<HTMLButtonElement>}
      variant="outline"
      className={cn(
        "-translate-y-1/2 absolute top-1/2 left-0 z-51 h-6 w-4 p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        "cursor-grab active:cursor-grabbing",
        "opacity-0 transition-opacity duration-100 group-hover/row:opacity-100",
      )}
      onClick={() => editor.tf.select(element)}
    >
      <GripVertical className="text-muted-foreground" />
    </Button>
  );
}

function RowDropLine() {
  const { dropLine } = useDropLine();
  if (!dropLine) return null;

  return (
    <div
      className={cn(
        "absolute inset-x-0 left-2 z-50 h-0.5 bg-primary/50",
        dropLine === "top" ? "-top-px" : "-bottom-px",
      )}
    />
  );
}

// ─── TableCellElement ────────────────────────────────────────────────────────

export function TableCellElement({
  isHeader,
  ...props
}: PlateElementProps<TTableCellElement> & { isHeader?: boolean }) {
  const readOnly = useReadOnly();
  const element = props.element;
  const { api } = useEditorPlugin(TablePlugin);
  const borders = useTableCellBorders({ element });
  const { col, row } = useCellIndices();

  const colSpan = api.table.getColSpan(element);
  const rowSpan = api.table.getRowSpan(element);

  const width = React.useMemo(() => {
    const terms = Array.from(
      { length: colSpan },
      (_, offset) => `var(--table-col-${col + offset}, 120px)`,
    );
    if (terms.length === 1) return terms[0] ?? "";
    return `calc(${terms.join(" + ")})`;
  }, [col, colSpan]);

  const colIndex = col + colSpan - 1;
  const rowIndex = row + rowSpan - 1;

  const tableId = useElementSelector(([node]) => node.id as string, [], { key: KEYS.table });
  const rowId = useElementSelector(([node]) => node.id as string, [], { key: KEYS.tr });
  const isSelectingTable = useBlockSelected(tableId);
  const isSelectingRow = useBlockSelected(rowId) || isSelectingTable;
  const isSelectionAreaVisible = usePluginOption(BlockSelectionPlugin, "isSelectionAreaVisible");

  return (
    <PlateElement
      {...props}
      as={isHeader ? "th" : "td"}
      className={cn(
        "relative h-full overflow-visible border-none bg-background p-0",
        element.background ? "bg-[var(--cellBackground)]" : "bg-background",
        isHeader && "text-left",
        "before:size-full",
        "data-[table-cell-selected=true]:before:z-10",
        "data-[table-cell-selected=true]:before:bg-primary/5",
        "before:absolute before:box-border before:select-none before:content-['']",
        borders.bottom?.size && "before:border-b before:border-b-border",
        borders.right?.size && "before:border-r before:border-r-border",
        borders.left?.size && "before:border-l before:border-l-border",
        borders.top?.size && "before:border-t before:border-t-border",
      )}
      style={
        {
          "--cellBackground": element.background,
          maxWidth: width,
          minWidth: width,
        } as React.CSSProperties
      }
      attributes={{
        ...props.attributes,
        colSpan,
        "data-table-cell-id": element.id,
        rowSpan,
      }}
    >
      <div
        className="relative z-20 box-border h-full px-3 py-2"
        style={rowSpan === 1 ? { minHeight: "var(--tableRowMinHeight, 0px)" } : undefined}
      >
        {props.children}
      </div>

      {!readOnly && !isSelectionAreaVisible && (
        <TableCellResizeControls colIndex={colIndex} rowIndex={rowIndex} />
      )}

      {isSelectingRow && (
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-primary/[.13]"
          contentEditable={false}
        />
      )}
    </PlateElement>
  );
}

export function TableCellHeaderElement(props: React.ComponentProps<typeof TableCellElement>) {
  return <TableCellElement {...props} isHeader />;
}

// ─── Resize Controls ─────────────────────────────────────────────────────────

const TableCellResizeControls = React.memo(function TableCellResizeControls({
  colIndex,
  rowIndex,
}: {
  colIndex: number;
  rowIndex: number;
}) {
  const { clearResizePreview, disableMarginLeft, setResizePreview, startResize } =
    useTableResizeContext();
  const rightKey = `right:${rowIndex}:${colIndex}`;
  const bottomKey = `bottom:${rowIndex}:${colIndex}`;
  const leftKey = `left:${rowIndex}:${colIndex}`;
  const isLeftHandle = colIndex === 0 && !disableMarginLeft;

  return (
    <div
      className="group/resize pointer-events-none absolute inset-0 z-30 select-none"
      contentEditable={false}
      suppressContentEditableWarning
    >
      {/* Right resize handle */}
      <div
        className="-top-2 -right-1 pointer-events-auto absolute z-40 h-[calc(100%_+_8px)] w-2 cursor-col-resize touch-none"
        onPointerEnter={(e) =>
          setResizePreview(e, { colIndex, direction: "right", handleKey: rightKey, rowIndex })
        }
        onPointerLeave={() => clearResizePreview(rightKey)}
        onPointerDown={(e) =>
          startResize(e, { colIndex, direction: "right", handleKey: rightKey, rowIndex })
        }
      />
      {/* Bottom resize handle */}
      <div
        className="-bottom-1 pointer-events-auto absolute left-0 z-40 h-2 w-full cursor-row-resize touch-none"
        onPointerEnter={(e) =>
          setResizePreview(e, { colIndex, direction: "bottom", handleKey: bottomKey, rowIndex })
        }
        onPointerLeave={() => clearResizePreview(bottomKey)}
        onPointerDown={(e) =>
          startResize(e, { colIndex, direction: "bottom", handleKey: bottomKey, rowIndex })
        }
      />
      {/* Left resize handle (first column only) */}
      {isLeftHandle && (
        <div
          className="-left-1 pointer-events-auto absolute top-0 z-40 h-full w-2 cursor-col-resize touch-none"
          onPointerEnter={(e) =>
            setResizePreview(e, { colIndex, direction: "left", handleKey: leftKey, rowIndex })
          }
          onPointerLeave={() => clearResizePreview(leftKey)}
          onPointerDown={(e) =>
            startResize(e, { colIndex, direction: "left", handleKey: leftKey, rowIndex })
          }
        />
      )}
    </div>
  );
});

TableCellResizeControls.displayName = "TableCellResizeControls";
