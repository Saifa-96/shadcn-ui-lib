import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Avatar</h2>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>WS</AvatarFallback>
        </Avatar>
      </div>
    </section>
  );
}
