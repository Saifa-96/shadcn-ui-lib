import { BlockSelectionPlugin } from "@platejs/selection/react";
import { getPluginTypes, KEYS } from "platejs";

export const BlockSelectionKit = BlockSelectionPlugin.configure(({ editor }) => ({
  options: {
    enableContextMenu: true,
    isSelectable: (element) =>
      !getPluginTypes(editor, [KEYS.column, KEYS.codeLine, KEYS.td]).includes(
        element.type
      ),
  },
}));
