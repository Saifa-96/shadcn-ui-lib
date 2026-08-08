import {
  deleteColumn,
  deleteRow,
  deleteTable,
  getTableAbove,
  insertTable,
  insertTableColumn,
  insertTableRow,
  mergeTableCells,
  splitTableCell,
} from "@platejs/table";
import { useTableMergeState } from "@platejs/table/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BoldIcon,
  CombineIcon,
  ItalicIcon,
  SquareSplitHorizontalIcon,
  TableIcon,
  Trash2Icon,
  UnderlineIcon,
  XIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import {
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
  useMarkToolbarButton,
  useMarkToolbarButtonState,
} from "platejs/react";
import { CommentToolbarButton } from "../comments/comment-toolbar-button";
import { SuggestionToolbarButton } from "../comments/suggestion-toolbar-button";
import { RedoToolbarButton, UndoToolbarButton } from "./history-toolbar-button";
import { IndentToolbarButton, OutdentToolbarButton } from "./indent-toolbar-button";
import { InsertImageToolbarButton } from "./insert-image-toolbar-button";
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from "./list-toolbar-button";
import { ToolbarButton, ToolbarGroup } from "./toolbar";
import { TurnIntoToolbarButton } from "./turn-into-toolbar-button";

export function FixedToolbarButtons() {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>
          <ToolbarGroup>
            <TurnIntoToolbarButton />
          </ToolbarGroup>
          <ToolbarGroup>
            <BulletedListToolbarButton />
            <NumberedListToolbarButton />
            <TodoListToolbarButton />
          </ToolbarGroup>
          <ToolbarGroup>
            <MarkButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkButton>
            <MarkButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkButton>
            <MarkButton nodeType={KEYS.underline} tooltip="Underline (⌘+U)">
              <UnderlineIcon />
            </MarkButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarButton tooltip="Insert Table" onClick={() => insertTable(editor, {})}>
              <TableIcon />
            </ToolbarButton>
            <InsertImageToolbarButton />
          </ToolbarGroup>
          <TableToolbarButtons />
        </>
      )}
    </div>
  );
}

interface MarkButtonProps {
  nodeType: string;
  tooltip: string;
  children: React.ReactNode;
}

function MarkButton({ nodeType, tooltip, children }: MarkButtonProps) {
  const state = useMarkToolbarButtonState({ nodeType });
  const { props } = useMarkToolbarButton(state);
  const { pressed, ...restProps } = props;

  return (
    <ToolbarButton tooltip={tooltip} pressed={pressed} {...restProps}>
      {children}
    </ToolbarButton>
  );
}

function TableToolbarButtons() {
  const editor = useEditorRef();
  const isInTable = useEditorSelector((editor) => !!getTableAbove(editor), []);
  const { canMerge, canSplit } = useTableMergeState();

  if (!isInTable) return null;

  return (
    <>
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
        <ToolbarButton
          tooltip="Delete table"
          onClick={() => deleteTable(editor)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Trash2Icon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup>
        <CommentToolbarButton />
        <SuggestionToolbarButton />
      </ToolbarGroup>
    </>
  );
}
