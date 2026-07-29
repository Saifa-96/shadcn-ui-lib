import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SwitchSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Switch</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="notifications" defaultChecked />
          <Label htmlFor="notifications">Notifications</Label>
        </div>
      </div>
    </section>
  );
}
