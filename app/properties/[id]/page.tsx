"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/app-store";
import {
  Star,
  Heart,
  MapPin,
  ArrowLeft,
  Wifi,
  Car,
  Utensils,
  Wind,
  Tv,
  Bath,
  Users,
  Bed,
  Share2,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-5 w-5" />,
  Parking: <Car className="h-5 w-5" />,
  Kitchen: <Utensils className="h-5 w-5" />,
  AC: <Wind className="h-5 w-5" />,
  Pool: <Bath className="h-5 w-5" />,
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const { getPropertyById, createBooking } = useAppStore();
  const property = getPropertyById(propertyId);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    guests: 1,
    name: "",
    email: "",
  });

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Header />
        <main className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            Property not found
          </h1>
          <Link href="/search" className="mt-4">
            <Button variant="outline">Back to search</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBooking = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.name || !bookingData.email) {
      alert("Please fill in all booking details");
      return;
    }

    const nights =
      (bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) /
      (1000 * 60 * 60 * 24);
    const totalPrice = property.pricePerNight * nights;

    createBooking(
      property.id,
      bookingData.name,
      bookingData.email,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.guests,
      totalPrice
    );

    setBookingOpen(false);
    alert("Booking confirmed! You will receive a confirmation email shortly.");
  };

  const totalPrice = bookingData.checkIn && bookingData.checkOut
    ? property.pricePerNight *
      ((bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) /
        (1000 * 60 * 60 * 24))
    : 0;

  const serviceFee = Math.round(totalPrice * 0.12);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/search" className="mb-6 inline-flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to search</span>
        </Link>

        {/* Image Gallery */}
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl md:aspect-[21/9]">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              {property.name}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="text-sm capitalize">
                {property.type}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-semibold">4.8</span>
                <span className="text-muted-foreground">(245 reviews)</span>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-6 border-b pb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{property.maxGuests} max guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <span>
                  {property.bedrooms} bedroom{property.bedrooms > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span>
                  {property.bathrooms} bathroom{property.bathrooms > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                About this place
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Discover the perfect accommodation in {property.location}. This {property.type.toLowerCase()} features modern amenities and is perfect for travelers looking for comfort and convenience.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <span className="text-muted-foreground">
                      {amenityIcons[amenity as keyof typeof amenityIcons] || (
                        <Wifi className="h-5 w-5" />
                      )}
                    </span>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border border-border">
              <CardHeader>
                <CardTitle className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    ${property.pricePerNight}
                  </span>
                  <span className="text-base font-normal text-muted-foreground">
                    / night
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Reserve
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Your Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">CHECK-IN</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                              >
                                {bookingData.checkIn
                                  ? format(bookingData.checkIn, "MMM d")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={bookingData.checkIn || undefined}
                                onSelect={(date) =>
                                  setBookingData({
                                    ...bookingData,
                                    checkIn: date || null,
                                  })
                                }
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label className="text-xs">CHECK-OUT</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                              >
                                {bookingData.checkOut
                                  ? format(bookingData.checkOut, "MMM d")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={bookingData.checkOut || undefined}
                                onSelect={(date) =>
                                  setBookingData({
                                    ...bookingData,
                                    checkOut: date || null,
                                  })
                                }
                                disabled={(date) =>
                                  date <= (bookingData.checkIn || new Date())
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div>
                        <Label>Guest Name</Label>
                        <Input
                          placeholder="Your name"
                          value={bookingData.name}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={bookingData.email}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      {totalPrice > 0 && (
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              ${property.pricePerNight} x{" "}
                              {Math.ceil(
                                (bookingData.checkOut!.getTime() -
                                  bookingData.checkIn!.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              nights
                            </span>
                            <span>${Math.round(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Service fee
                            </span>
                            <span>${serviceFee}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 font-semibold">
                            <span>Total</span>
                            <span>${Math.round(totalPrice + serviceFee)}</span>
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={handleBooking}
                      >
                        Confirm Booking
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        {"You won't be charged until you confirm"}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <p className="text-center text-sm text-muted-foreground">
                  {"You won't be charged yet"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
