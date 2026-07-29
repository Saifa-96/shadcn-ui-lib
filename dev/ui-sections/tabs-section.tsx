import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Tabs</h2>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-sm text-muted-foreground">
          Account settings and preferences.
        </TabsContent>
        <TabsContent value="password" className="text-sm text-muted-foreground">
          Change your password here.
        </TabsContent>
        <TabsContent value="settings" className="text-sm text-muted-foreground">
          General application settings.
        </TabsContent>
      </Tabs>
    </section>
  );
}
