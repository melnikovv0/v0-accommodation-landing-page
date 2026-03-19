"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: variant === "icon" ? "h-6 w-6" : "h-6",
    md: variant === "icon" ? "h-8 w-8" : "h-8",
    lg: variant === "icon" ? "h-10 w-10" : "h-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  if (variant === "icon") {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary",
          sizeClasses[size],
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[60%] w-[60%]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House/building icon with door */}
          <path
            d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
            fill="currentColor"
            className="text-primary-foreground"
          />
          <path
            d="M9 21V14H15V21"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary"
          />
          <circle
            cx="12"
            cy="8"
            r="2"
            fill="currentColor"
            className="text-accent"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary",
          variant === "full" ? sizeClasses[size] : ""
        )}
        style={{
          width: size === "sm" ? 24 : size === "md" ? 32 : 40,
          height: size === "sm" ? 24 : size === "md" ? 32 : 40,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[60%] w-[60%]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
            fill="currentColor"
            className="text-primary-foreground"
          />
          <path
            d="M9 21V14H15V21"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary"
          />
          <circle
            cx="12"
            cy="8"
            r="2"
            fill="currentColor"
            className="text-accent"
          />
        </svg>
      </div>
      <span
        className={cn(
          "font-semibold tracking-tight text-foreground",
          textSizeClasses[size]
        )}
      >
        StayHub
      </span>
    </div>
  );
}

// Sidebar variant with light text
export function SidebarLogo({
  size = "md",
  collapsed = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  collapsed?: boolean;
  className?: string;
}) {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center justify-center rounded-lg bg-sidebar-primary"
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[60%] w-[60%]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
            fill="currentColor"
            className="text-sidebar-primary-foreground"
          />
          <path
            d="M9 21V14H15V21"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-sidebar-primary"
          />
          <circle
            cx="12"
            cy="8"
            r="2"
            fill="currentColor"
            className="text-sidebar-foreground"
          />
        </svg>
      </div>
      {!collapsed && (
        <span
          className={cn(
            "font-semibold tracking-tight text-sidebar-foreground",
            textSizeClasses[size]
          )}
        >
          StayHub
        </span>
      )}
    </div>
  );
}
