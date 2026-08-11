import { Navigate, NavLink, Route, Routes } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockEditorPage } from "./pages/block-editor-page";
import { ChatPage } from "./pages/chat-page";
import { FormPage } from "./pages/form-page";
import { UiPage } from "./pages/ui-page";

export function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center gap-6 px-6">
            <span className="text-sm font-bold text-foreground">ws-ui dev</span>
            <nav className="flex gap-1">
              <NavButton to="/ui">UI Components</NavButton>
              <NavButton to="/chat">Chat</NavButton>
              <NavButton to="/block-editor">Block Editor</NavButton>
              <NavButton to="/form">Form</NavButton>
            </nav>
          </div>
        </header>

        <main className="px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/ui" replace />} />
            <Route path="/ui" element={<UiPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/block-editor" element={<BlockEditorPage />} />
            <Route path="/form" element={<FormPage />} />
          </Routes>
        </main>
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
        `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
