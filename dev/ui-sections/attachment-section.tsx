import { FileCodeIcon, FileTextIcon, XIcon } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
    name: "workspace.png",
    meta: "PNG · 820 KB",
  },
  {
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80",
    name: "desk-reference.jpg",
    meta: "JPG · 1.1 MB",
  },
  {
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80",
    name: "office-reference.jpg",
    meta: "JPG · 940 KB",
  },
];

const FILES = [
  { icon: FileTextIcon, name: "sales-dashboard.pdf", meta: "PDF · 2.4 MB", state: "done" as const },
  {
    icon: FileCodeIcon,
    name: "message-renderer.tsx",
    meta: "Uploading · 64%",
    state: "uploading" as const,
  },
];

export function AttachmentSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Attachment</h2>

      {/* Image mode: vertical cards in a horizontal scrolling group */}
      <AttachmentGroup>
        {IMAGES.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={image.src} alt={image.name} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${image.name}`}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </AttachmentGroup>

      {/* File mode: horizontal rows stacked vertically */}
      <div className="flex flex-col gap-2">
        {FILES.map((file) => (
          <Attachment key={file.name} state={file.state} className="w-80">
            <AttachmentMedia>
              <file.icon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{file.name}</AttachmentTitle>
              <AttachmentDescription>{file.meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${file.name}`}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </div>
    </section>
  );
}
