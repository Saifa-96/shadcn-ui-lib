import { Navigate, NavLink, Route, Routes } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockEditorPage } from "./pages/block-editor-page";
import { FormPage } from "./pages/form-page";
import { UiPage } from "./pages/ui-page";

export function App() {
  return (
    <TooltipProvider>
      <div className="mx-auto max-w-5xl p-8">
        <h1 className="text-2xl font-bold text-foreground">ws-ui dev</h1>

        <nav className="mt-4 flex gap-1 border-b border-border">
          <NavButton to="/ui">UI Components</NavButton>
          <NavButton to="/block-editor">Block Editor</NavButton>
          <NavButton to="/form">Form</NavButton>
        </nav>

        <div className="mt-8">
          <Routes>
            <Route path="/" element={<Navigate to="/ui" replace />} />
            <Route path="/ui" element={<UiPage />} />
            <Route path="/block-editor" element={<BlockEditorPage />} />
            <Route path="/form" element={<FormPage />} />
          </Routes>
        </div>
      </div>

      <Toaster />
    </TooltipProvider>
  );
}

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
}

function NavButton({ to, children }: NavButtonProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "border-b-2 border-primary text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
