import type { Value } from "platejs";

import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { plugins } from "./plugins";

export interface BlockEditorProps {
  initialValue?: Value;
  onValueChange?: (v: Value) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = (props) => {
  const { initialValue, onValueChange } = props;

  const editor = usePlateEditor({
    plugins,
    value: initialValue,
  });

  return (
    <Plate editor={editor} onChange={({ value }) => onValueChange?.(value)}>
      <PlateContent
        style={{ padding: "16px 64px", minHeight: "100px" }}
        placeholder="Type your amazing content here..."
      />
    </Plate>
  );
};
