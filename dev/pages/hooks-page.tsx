import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  UserEditorDialog,
  type UserPayload,
  useUserEditorTrigger,
} from "../demos/user-editor-dialog";

export function HooksPage() {
  const editorRef = useUserEditorTrigger();

  const openEditor = (user: UserPayload | null) => {
    editorRef.current.open(user ?? { id: 0, name: "" });
    editorRef.current.setLoading(true);
    window.setTimeout(() => {
      editorRef.current.setLoading(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Hooks</h1>
        <p className="text-sm text-muted-foreground">
          <code className="font-mono">useIsMobile</code> tracks the viewport, while{" "}
          <code className="font-mono">useModalState</code> and{" "}
          <code className="font-mono">defineDialogTrigger</code> drive a dialog imperatively.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">useIsMobile</h2>
        <UseIsMobileDemo />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          useModalState + defineDialogTrigger
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={() => openEditor({ id: 1, name: "Alice" })}>
            Edit Alice
          </Button>
          <Button type="button" onClick={() => openEditor({ id: 2, name: "Bob" })}>
            Edit Bob
          </Button>
          <Button type="button" variant="outline" onClick={() => openEditor(null)}>
            Create new
          </Button>
          <Button type="button" variant="ghost" onClick={() => editorRef.current.close()}>
            Close (imperative)
          </Button>
        </div>
        <UserEditorDialog ref={editorRef} />
        <pre className="overflow-auto rounded-md bg-muted p-4 text-xs text-foreground">
          {`// user-editor-dialog.tsx — both steps live in the dialog's own file

// 1. create the control hook with defineDialogTrigger and export it
export const useUserEditorTrigger = defineDialogTrigger<User>();

// 2. the dialog accepts the ref and drives it with useModalState
export function UserEditorDialog({ ref }: ModalRefProps<User>) {
  const { isOpen, isLoading, payload, onOpenChange } = useModalState<User>(ref);
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>…</Dialog>;
}

// consumer
const ref = useUserEditorTrigger();
ref.current.open(user);
return <UserEditorDialog ref={ref} />;`}
        </pre>
      </section>
    </div>
  );
}

function UseIsMobileDemo() {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Current viewport</p>
        <p className="text-xs text-muted-foreground">
          Drag the window narrower than 768px and the value flips to mobile.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
          isMobile = {String(isMobile)}
        </code>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isMobile ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {isMobile ? "Mobile" : "Desktop"}
        </span>
      </div>
    </div>
  );
}
