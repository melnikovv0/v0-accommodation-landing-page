"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useModuleStore } from "@/lib/module-store";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  TrendingUp,
  Wrench,
  Users,
  Save,
} from "lucide-react";

const moduleIcons: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-5 w-5" />,
  properties: <Building2 className="h-5 w-5" />,
  reservations: <Calendar className="h-5 w-5" />,
  financial: <TrendingUp className="h-5 w-5" />,
  maintenance: <Wrench className="h-5 w-5" />,
  employees: <Users className="h-5 w-5" />,
};

export default function SystemSettingsPage() {
  const { modules, toggleModule } = useModuleStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure and manage available modules in your UIS platform
        </p>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Module Management</CardTitle>
          <CardDescription>
            Enable or disable specific modules to customize your system. Changes take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1 text-accent">
                  {moduleIcons[module.id] || <Building2 className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {module.name}
                    </h3>
                    {module.enabled ? (
                      <Badge className="bg-accent/20 text-accent">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => toggleModule(module.id)}
                  aria-label={`Toggle ${module.name}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Module Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card
            key={module.id}
            className={`border ${
              module.enabled
                ? "border-accent/50 bg-accent/5"
                : "border-border/50 opacity-60"
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="text-accent">
                  {moduleIcons[module.id] || <Building2 className="h-5 w-5" />}
                </div>
                {module.enabled && (
                  <Badge className="bg-accent/20 text-accent text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-3 text-lg">{module.name}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant={module.enabled ? "default" : "outline"}
                className="w-full"
                onClick={() => toggleModule(module.id)}
              >
                {module.enabled ? "Disable" : "Enable"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
