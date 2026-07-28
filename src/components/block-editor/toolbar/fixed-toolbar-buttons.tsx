import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { KEYS } from "platejs";
import {
  useEditorReadOnly,
  useMarkToolbarButton,
  useMarkToolbarButtonState,
} from "platejs/react";

import { ToolbarButton, ToolbarGroup } from "./toolbar";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  if (readOnly) return null;

  return (
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
