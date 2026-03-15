"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UisSidebar } from "@/components/uis/sidebar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, isOwner, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/auth/login?redirect=/admin");
      } else if (!isOwner) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isOwner, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message while redirecting
  if (!isAuthenticated || !isOwner) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <div>
            <h2 className="text-lg font-semibold">Access Denied</h2>
            <p className="text-sm text-muted-foreground">
              {!isAuthenticated
                ? "Please sign in to access this page."
                : "You don't have permission to access the owner dashboard."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UisSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          "flex-1 overflow-auto transition-all duration-300"
        )}
      >
        {children}
      </main>
    </div>
  );
}
