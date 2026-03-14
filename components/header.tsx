"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/explore" className="flex items-center gap-2">
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
              href="#"
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
            <Link href="/admin">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                Owner Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              Sign in
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Register
            </Button>
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
                href="#"
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
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground"
                >
                  Sign in
                </Button>
                <Button className="w-full bg-accent text-accent-foreground">
                  Register
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
