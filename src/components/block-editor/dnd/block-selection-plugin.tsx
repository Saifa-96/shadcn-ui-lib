import { BlockMenuPlugin, BlockSelectionPlugin } from "@platejs/selection/react";
import { getPluginTypes, KEYS } from "platejs";

import { BlockSelection } from "./block-selection";
import { BlockContextMenu } from "./block-context-menu";

export const BlockSelectionKit = BlockSelectionPlugin.configure(({ editor }) => ({
  options: {
    enableContextMenu: true,
    isSelectable: (element) =>
      !getPluginTypes(editor, [KEYS.column, KEYS.codeLine, KEYS.td]).includes(
        element.type
      ),
  },
  render: {
    belowRootNodes: (props) => {
      if (!props.attributes.className?.includes("slate-selectable"))
        return null;

      return <BlockSelection />;
    },
  },
}));

export const BlockMenuKit = BlockMenuPlugin.configure({
  render: { aboveEditable: BlockContextMenu },
});
