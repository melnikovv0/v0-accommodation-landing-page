import Link from "next/link";
import { Building2, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Building2 className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            StayHub
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your complete accommodation platform
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
        {/* Guest Card */}
        <Link href="/explore" className="block">
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
            <CardHeader className="pb-4">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Guest</CardTitle>
              <CardDescription className="text-base">
                Looking for your perfect stay? Browse our curated accommodations worldwide.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-primary">
                <span className="font-medium">Explore accommodations</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Owner Card */}
        <Link href="/admin" className="block">
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-accent/50">
            <CardHeader className="pb-4">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                <Building2 className="h-7 w-7 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Property Owner</CardTitle>
              <CardDescription className="text-base">
                Manage your properties, track bookings, and analyze your business performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-accent-foreground">
                <span className="font-medium">Go to dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        New to StayHub?{" "}
        <Button variant="link" className="h-auto p-0 text-primary">
          Learn more about our platform
        </Button>
      </p>
    </main>
  );
}
