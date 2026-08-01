import type { SlateEditor, Value } from "platejs";

import { blockEditorValueSchema } from "./schema";

interface AgentEditSuccess {
  success: true;
}

interface AgentEditFailure {
  success: false;
  error: { issues: Array<{ path: Array<string | number>; message: string }> };
}

export type AgentEditResult = AgentEditSuccess | AgentEditFailure;

/**
 * Execute an agent edit with snapshot + validate + rollback.
 *
 * 1. Snapshots current editor.children and selection
 * 2. Runs the provided edit function
 * 3. Validates the result with blockEditorValueSchema
 * 4. On failure: restores the snapshot and returns the error
 * 5. On success: commits as a single undo batch
 */
export function withAgentEdit(editor: SlateEditor, fn: () => void): AgentEditResult {
  const snapshot = structuredClone(editor.children) as Value;
  const selectionBefore = editor.selection ? structuredClone(editor.selection) : null;

  // Run the edit in a new undo batch so it can be undone as one step
  editor.tf.withNewBatch(() => {
    fn();
  });

  // Validate the result
  const result = blockEditorValueSchema.safeParse(editor.children);

  if (!result.success) {
    // Rollback: restore snapshot without saving to history
    editor.tf.withoutSaving(() => {
      // Remove all current nodes
      for (let i = editor.children.length - 1; i >= 0; i--) {
        editor.tf.removeNodes({ at: [i] });
      }
      // Restore original nodes
      editor.tf.insertNodes(structuredClone(snapshot), { at: [0] });
    });

    // Restore selection
    if (selectionBefore) {
      editor.tf.select(selectionBefore);
    } else {
      editor.tf.deselect();
    }

    // Remove the failed batch from undo history
    editor.history.undos.pop();

    return {
      success: false,
      error: {
        issues: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
    };
  }

  return { success: true };
}
