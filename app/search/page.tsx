"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, MapPin, Filter } from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";

export default function SearchPage() {
  const { searchFilters, filteredProperties } = useAppStore();
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const properties = filteredProperties();
  const accommodationTypes = [
    { id: "apartment", label: "Apartment" },
    { id: "house", label: "House" },
    { id: "villa", label: "Villa" },
    { id: "studio", label: "Studio" },
  ];

  const filtered = properties.filter((property) => {
    const inPriceRange =
      property.pricePerNight >= priceRange[0] &&
      property.pricePerNight <= priceRange[1];
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(property.type);
    return inPriceRange && matchesType;
  });

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {searchFilters.destination
              ? `Properties in ${searchFilters.destination}`
              : "Search Results"}
          </h1>
          {searchFilters.checkIn && searchFilters.checkOut && (
            <p className="mt-2 text-muted-foreground">
              {format(searchFilters.checkIn, "MMM d")} -{" "}
              {format(searchFilters.checkOut, "MMM d")} · {searchFilters.guests.adults + searchFilters.guests.children} guests,{" "}
              {searchFilters.guests.rooms} room
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6 rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground">Filters</h2>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 font-medium text-foreground">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="mb-3 font-medium text-foreground">Property Type</h3>
                <div className="space-y-2">
                  {accommodationTypes.map((type) => (
                    <div key={type.id} className="flex items-center gap-2">
                      <Checkbox
                        id={type.id}
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={() => toggleType(type.id)}
                      />
                      <Label
                        htmlFor={type.id}
                        className="cursor-pointer font-normal text-foreground"
                      >
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters Button */}
          <div className="mb-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down your search</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  {/* Price Range */}
                  <div>
                    <h3 className="mb-3 font-medium text-foreground">Price Range</h3>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={1000}
                      step={10}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <h3 className="mb-3 font-medium text-foreground">Property Type</h3>
                    <div className="space-y-2">
                      {accommodationTypes.map((type) => (
                        <div key={type.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`mobile-${type.id}`}
                            checked={selectedTypes.includes(type.id)}
                            onCheckedChange={() => toggleType(type.id)}
                          />
                          <Label
                            htmlFor={`mobile-${type.id}`}
                            className="cursor-pointer font-normal text-foreground"
                          >
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="block"
                  >
                    <Card className="group overflow-hidden border border-border transition-all hover:shadow-lg">
                      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden md:aspect-auto">
                          <Image
                            src={property.image}
                            alt={property.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-3 top-3 h-9 w-9 rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:text-destructive"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Heart className="h-5 w-5" />
                            <span className="sr-only">Add to favorites</span>
                          </Button>
                        </div>

                        {/* Details */}
                        <CardContent className="flex flex-col justify-between p-4">
                          <div>
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {property.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{property.location}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-foreground">
                                  ${property.pricePerNight}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  per night
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="secondary" className="font-normal">
                                {property.bedrooms} bed
                                {property.bedrooms > 1 ? "s" : ""}
                              </Badge>
                              <Badge variant="secondary" className="font-normal">
                                {property.bathrooms} bath
                                {property.bathrooms > 1 ? "s" : ""}
                              </Badge>
                              <Badge variant="secondary" className="font-normal">
                                {property.type}
                              </Badge>
                            </div>
                            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                              {property.amenities.join(" · ")}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-medium text-foreground">
                                4.8
                              </span>
                              <span className="text-sm text-muted-foreground">
                                (245 reviews)
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-accent text-accent-foreground hover:bg-accent/90"
                              onClick={(e) => e.preventDefault()}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border border-border bg-card p-12 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">No properties found</p>
                  <p className="mt-2 text-sm">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
