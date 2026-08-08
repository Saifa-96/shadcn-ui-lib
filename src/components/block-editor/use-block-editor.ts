"use client";

import type { Value } from "platejs";
import type { PlateEditor } from "platejs/react";
import { usePlateEditor } from "platejs/react";
import * as React from "react";

import { discussionPlugin, type TDiscussion, type TUser } from "./comments/discussion-kit";
import { suggestionPlugin } from "./comments/suggestion-kit";
import { plugins } from "./plugins";

export type { TDiscussion, TUser };

/**
 * Discussion threads and user info, injected into the editor via
 * {@link useBlockEditor} (or {@link setDiscussionData}). Threads live outside
 * the document value — comment marks live in the doc, thread contents here.
 */
export interface DiscussionData {
  currentUserId: string;
  discussions: TDiscussion[];
  users: Record<string, TUser>;
}

export interface UseBlockEditorOptions {
  /** Initial document value (uncontrolled — only used at creation). */
  initialValue?: Value;
  /** Initial discussion data, injected once on mount. */
  discussionData?: DiscussionData;
  /**
   * Called whenever the discussions mutate inside the editor (add, reply,
   * edit, delete a comment, resolve or remove a thread). Persist the data
   * here. Not called for the initial injection or the mount baseline.
   */
  onDiscussionChange?: (data: DiscussionData) => void;
}

/**
 * Create a Plate editor bound to the block-editor plugins. The returned
 * editor is passed to {@link BlockEditor} as the `editor` prop, giving the
 * caller full access for transforms, options, and discussion data.
 */
export function useBlockEditor(options: UseBlockEditorOptions = {}) {
  const editor = usePlateEditor({ plugins, value: options.initialValue });

  const [discussionData, setDiscussionDataState] = React.useState<DiscussionData | undefined>(
    options.discussionData,
  );

  const updateDiscussionData = React.useCallback(
    (data: DiscussionData) => {
      setDiscussionDataState(data);
      setDiscussionData(editor, data);
    },
    [editor],
  );

  // Inject the initial discussion data exactly once. The guard decouples the
  // injection from editor identity (a future editor rebuild must not re-inject
  // the stale initial value over updates made via setDiscussionData).
  const initialInjectedRef = React.useRef(false);
  // Reference to the initially injected discussions, used to suppress the
  // change callback for the injection itself (the caller already knows it).
  const baselineDiscussionsRef = React.useRef<TDiscussion[] | null>(null);

  React.useEffect(() => {
    if (initialInjectedRef.current) return;
    if (!options.discussionData) return;

    initialInjectedRef.current = true;
    baselineDiscussionsRef.current = options.discussionData.discussions;
    setDiscussionData(editor, options.discussionData);
  }, [editor, options.discussionData]);

  // Mirror the latest callback without re-subscribing (assign during render,
  // not in an effect).
  const onDiscussionChangeRef = React.useRef(options.onDiscussionChange);
  onDiscussionChangeRef.current = options.onDiscussionChange;

  // Keep the returned discussionData in sync with in-editor mutations and
  // surface them to the caller for persistence. Subscribes to the plugin's
  // options store directly (not the Plate context, which is unavailable
  // before the editor renders). Skip the mount baseline and the initial
  // injection (same reference as the baseline).
  const discussionStore = editor.getOptionsStore(discussionPlugin);
  const currentUserId = discussionStore.useValue("currentUserId");
  const discussions = discussionStore.useValue("discussions");
  const users = discussionStore.useValue("users");
  const firstSyncRef = React.useRef(true);

  React.useEffect(() => {
    const data: DiscussionData = { currentUserId, discussions, users };

    setDiscussionDataState(data);

    if (firstSyncRef.current) {
      firstSyncRef.current = false;
      return;
    }
    if (baselineDiscussionsRef.current === discussions) return;

    onDiscussionChangeRef.current?.(data);
  }, [currentUserId, discussions, users]);

  return { editor, discussionData, setDiscussionData: updateDiscussionData };
}

/**
 * Apply discussion data to the editor's discussion plugin options.
 */
export function setDiscussionData(editor: PlateEditor, data: DiscussionData): void {
  editor.setOption(discussionPlugin, "currentUserId", data.currentUserId);
  editor.setOption(discussionPlugin, "discussions", data.discussions);
  editor.setOption(discussionPlugin, "users", data.users);
  // The suggestion plugin snapshots the current user id at init; keep it in
  // sync so new suggestions are attributed to the same user.
  editor.setOption(suggestionPlugin, "currentUserId", data.currentUserId);
}
