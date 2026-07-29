import * as React from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CombineIcon,
  Grid2X2Icon,
  SquareSplitHorizontalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import {
  deleteColumn,
  deleteRow,
  deleteTable,
  insertTableColumn,
  insertTableRow,
  mergeTableCells,
  splitTableCell,
} from "@platejs/table";
import {
  TablePlugin,
  useTableBordersDropdownMenuContentState,
  useTableMergeState,
} from "@platejs/table/react";
import { type TTableElement } from "platejs";
import {
  useEditorPlugin,
  useEditorRef,
  useEditorSelector,
  useElement,
  useFocusedLast,
  useRemoveNodeButton,
  useSelected,
} from "platejs/react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TablePopover, TablePopoverAnchor, TablePopoverContent } from "./table-popover";
import { Toolbar, ToolbarButton, ToolbarGroup } from "./toolbar";
import {
  BorderAllIcon,
  BorderBottomIcon,
  BorderLeftIcon,
  BorderNoneIcon,
  BorderRightIcon,
  BorderTopIcon,
} from "./table-icons";

const TABLE_MULTI_SELECTION_TOOLBAR_DELAY_MS = 150;

/**
 * Floating toolbar that appears when the cursor is inside a table.
 * Wraps the table element content with a Popover anchor.
 */
export function TableFloatingToolbar({ children }: { children: React.ReactNode }) {
  const selectedCellCount = useEditorSelector(
    (editor) => editor.getApi(TablePlugin).table.getSelectedCellIds()?.length ?? 0,
    []
  );
  const selected = useSelected();
  const isFocusedLast = useFocusedLast();
  const [isExpandedReady, setIsExpandedReady] = React.useState(false);

  const isSingleCellToolbarOpen = isFocusedLast && selected && selectedCellCount === 0;
  const isExpandedPending = isFocusedLast && selectedCellCount > 1;

  React.useEffect(() => {
    if (!isExpandedPending) {
      setIsExpandedReady(false);
      return;
    }
    const id = window.setTimeout(() => setIsExpandedReady(true), TABLE_MULTI_SELECTION_TOOLBAR_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [isExpandedPending]);

  const shouldShowExpanded = isExpandedReady && isExpandedPending;
  const isToolbarOpen = isSingleCellToolbarOpen || shouldShowExpanded;

  return (
    <TablePopover open={isToolbarOpen} modal={false}>
      <TablePopoverAnchor asChild>{children}</TablePopoverAnchor>
      {isSingleCellToolbarOpen && <SingleCellToolbarContent />}
      {shouldShowExpanded && <ExpandedSelectionToolbarContent />}
    </TablePopover>
  );
}

function ExpandedSelectionToolbarContent() {
  const editor = useEditorRef();
  const { canMerge, canSplit } = useTableMergeState();

  if (!canMerge && !canSplit) return null;

  return (
    <TablePopoverContent
      asChild
      side="top"
      align="center"
      sideOffset={8}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <Toolbar
        className="scrollbar-hide flex w-auto max-w-[80vw] flex-row overflow-x-auto rounded-md border bg-popover p-1 shadow-md print:hidden"
        contentEditable={false}
      >
        <ToolbarGroup>
          {canMerge && (
            <ToolbarButton
              tooltip="Merge cells"
              onClick={() => mergeTableCells(editor)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <CombineIcon />
            </ToolbarButton>
          )}
          {canSplit && (
            <ToolbarButton
              tooltip="Split cell"
              onClick={() => splitTableCell(editor)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <SquareSplitHorizontalIcon />
            </ToolbarButton>
          )}
        </ToolbarGroup>
      </Toolbar>
    </TablePopoverContent>
  );
}

function SingleCellToolbarContent() {
  const editor = useEditorRef();
  const element = useElement<TTableElement>();
  const { props: removeProps } = useRemoveNodeButton({ element });
  const { canSplit } = useTableMergeState();

  return (
    <TablePopoverContent
      asChild
      side="top"
      align="center"
      sideOffset={8}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <Toolbar
        className="scrollbar-hide flex w-auto max-w-[80vw] flex-row overflow-x-auto rounded-md border bg-popover p-1 shadow-md print:hidden"
        contentEditable={false}
      >
        <ToolbarGroup>
          {canSplit && (
            <ToolbarButton
              tooltip="Split cell"
              onClick={() => splitTableCell(editor)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <SquareSplitHorizontalIcon />
            </ToolbarButton>
          )}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              render={<ToolbarButton tooltip="Cell borders"><Grid2X2Icon /></ToolbarButton>}
            />
            <DropdownMenuPortal>
              <TableBordersDropdownMenuContent />
            </DropdownMenuPortal>
          </DropdownMenu>

          <ToolbarButton tooltip="Delete table" {...removeProps}>
            <Trash2Icon />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            tooltip="Insert row before"
            onClick={() => insertTableRow(editor, { before: true })}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ArrowUp />
          </ToolbarButton>
          <ToolbarButton
            tooltip="Insert row after"
            onClick={() => insertTableRow(editor)}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ArrowDown />
          </ToolbarButton>
          <ToolbarButton
            tooltip="Delete row"
            onClick={() => deleteRow(editor)}
            onMouseDown={(e) => e.preventDefault()}
          >
            <XIcon />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            tooltip="Insert column before"
            onClick={() => insertTableColumn(editor, { before: true })}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ArrowLeft />
          </ToolbarButton>
          <ToolbarButton
            tooltip="Insert column after"
            onClick={() => insertTableColumn(editor)}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ArrowRight />
          </ToolbarButton>
          <ToolbarButton
            tooltip="Delete column"
            onClick={() => deleteColumn(editor)}
            onMouseDown={(e) => e.preventDefault()}
          >
            <XIcon />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </TablePopoverContent>
  );
}

function TableBordersDropdownMenuContent() {
  const editor = useEditorRef();
  const {
    getOnSelectTableBorder,
    hasBottomBorder,
    hasLeftBorder,
    hasNoBorders,
    hasOuterBorders,
    hasRightBorder,
    hasTopBorder,
  } = useTableBordersDropdownMenuContentState();

  return (
    <DropdownMenuContent
      className="min-w-[220px]"
      align="start"
      side="right"
      sideOffset={0}
    >
      <DropdownMenuGroup>
        <DropdownMenuCheckboxItem checked={hasTopBorder} onCheckedChange={getOnSelectTableBorder("top")}>
          <BorderTopIcon />
          <div>Top Border</div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={hasRightBorder} onCheckedChange={getOnSelectTableBorder("right")}>
          <BorderRightIcon />
          <div>Right Border</div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={hasBottomBorder} onCheckedChange={getOnSelectTableBorder("bottom")}>
          <BorderBottomIcon />
          <div>Bottom Border</div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={hasLeftBorder} onCheckedChange={getOnSelectTableBorder("left")}>
          <BorderLeftIcon />
          <div>Left Border</div>
        </DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuCheckboxItem checked={hasNoBorders} onCheckedChange={getOnSelectTableBorder("none")}>
          <BorderNoneIcon />
          <div>No Border</div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={hasOuterBorders} onCheckedChange={getOnSelectTableBorder("outer")}>
          <BorderAllIcon />
          <div>Outside Borders</div>
        </DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
