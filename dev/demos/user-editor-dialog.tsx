import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { defineDialogTrigger, type ModalRefProps, useModalState } from "@/hooks/use-modal-state";

export interface UserPayload {
  id: number;
  name: string;
}

/**
 * Step 1 — create the control hook with defineDialogTrigger and export it
 * next to the dialog it drives.
 */
export const useUserEditorTrigger = defineDialogTrigger<UserPayload>();

/**
 * Step 2 — the dialog accepts the ref and drives it with useModalState.
 */
export function UserEditorDialog({ ref }: ModalRefProps<UserPayload>) {
  const { isOpen, isLoading, payload, onOpenChange } = useModalState<UserPayload>(ref);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userDialogTitle(payload)}</DialogTitle>
          <DialogDescription>
            {isLoading ? "Saving changes…" : userDialogDescription(payload)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function userDialogTitle(payload: UserPayload | null): string {
  if (payload === null || payload.id === 0) {
    return "Create user";
  }
  return "Edit user";
}

function userDialogDescription(payload: UserPayload | null): string {
  if (payload === null) {
    return "Create a new user";
  }
  return `Editing ${payload.name} (id ${payload.id})`;
}
