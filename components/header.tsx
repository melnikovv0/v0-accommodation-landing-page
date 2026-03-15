"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading, logout, isOwner } = useAuth();
  const router = useRouter();

  // Prevent hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {{/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="text-lg font-bold text-accent-foreground">S</span>
            </div>
            <span className="text-xl font-bold text-primary-foreground">
              StayHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              Stays
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              Flights
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              Car Rentals
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              Attractions
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden items-center gap-4 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Change language</span>
            </Button>

            {!mounted || isLoading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-primary-foreground/20" />
            ) : isAuthenticated && user ? (
              <>
                {/* Owner Dashboard Link - Only visible for owners/admins */}
                {isOwner && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      className="text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {isOwner && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Owner Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-primary-foreground/10 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stays
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flights
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Car Rentals
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Attractions
              </Link>

              {!mounted || isLoading ? (
                <div className="mt-4 h-10 animate-pulse rounded bg-primary-foreground/20" />
              ) : isAuthenticated && user ? (
                <div className="mt-4 flex flex-col gap-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-primary-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-primary-foreground/70 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Owner Dashboard
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-accent text-accent-foreground">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
