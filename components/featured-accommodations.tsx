"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const accommodations = [
  {
    id: 1,
    title: "Oceanfront Paradise Villa",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop",
    price: 450,
    rating: 4.9,
    reviews: 234,
    type: "Villa",
    featured: true,
  },
  {
    id: 2,
    title: "Alpine Mountain Chalet",
    location: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    price: 320,
    rating: 4.8,
    reviews: 189,
    type: "Chalet",
    featured: false,
  },
  {
    id: 3,
    title: "Historic City Center Apartment",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    price: 180,
    rating: 4.7,
    reviews: 412,
    type: "Apartment",
    featured: false,
  },
  {
    id: 4,
    title: "Luxury Beach Resort Suite",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    price: 280,
    rating: 4.9,
    reviews: 567,
    type: "Resort",
    featured: true,
  },
  {
    id: 5,
    title: "Modern Downtown Loft",
    location: "New York City",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    price: 220,
    rating: 4.6,
    reviews: 298,
    type: "Loft",
    featured: false,
  },
  {
    id: 6,
    title: "Serene Lake House Retreat",
    location: "Lake Como, Italy",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    price: 390,
    rating: 4.8,
    reviews: 156,
    type: "House",
    featured: true,
  },
];

export function FeaturedAccommodations() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Featured Accommodations
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked stays loved by travelers worldwide
            </p>
          </div>
          <Button variant="outline" className="shrink-0">
            View all properties
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accommodations.map((accommodation) => (
            <Card
              key={accommodation.id}
              className="group overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={accommodation.image}
                  alt={accommodation.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {accommodation.featured && (
                  <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
                    Featured
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-3 h-9 w-9 rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-background hover:text-destructive"
                >
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{accommodation.location}</span>
                </div>
                <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-card-foreground">
                  {accommodation.title}
                </h3>
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {accommodation.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">
                      {accommodation.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({accommodation.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      ${accommodation.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / night
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Book now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
