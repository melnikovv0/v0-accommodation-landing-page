"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  MapPin,
  CalendarDays,
  Users,
  Search,
  Minus,
  Plus,
} from "lucide-react";

const cities = [
  { name: "Paris", country: "France", popular: true },
  { name: "London", country: "United Kingdom", popular: true },
  { name: "New York City", country: "United States", popular: true },
  { name: "Tokyo", country: "Japan", popular: true },
  { name: "Barcelona", country: "Spain", popular: true },
  { name: "Rome", country: "Italy", popular: true },
  { name: "Dubai", country: "United Arab Emirates", popular: true },
  { name: "Amsterdam", country: "Netherlands", popular: false },
  { name: "Bangkok", country: "Thailand", popular: false },
  { name: "Singapore", country: "Singapore", popular: false },
  { name: "Sydney", country: "Australia", popular: false },
  { name: "Los Angeles", country: "United States", popular: false },
  { name: "Miami", country: "United States", popular: false },
  { name: "Berlin", country: "Germany", popular: false },
  { name: "Prague", country: "Czech Republic", popular: false },
  { name: "Vienna", country: "Austria", popular: false },
  { name: "Lisbon", country: "Portugal", popular: false },
  { name: "Madrid", country: "Spain", popular: false },
  { name: "Bali", country: "Indonesia", popular: true },
  { name: "Maldives", country: "Maldives", popular: true },
  { name: "Swiss Alps", country: "Switzerland", popular: false },
  { name: "Lake Como", country: "Italy", popular: false },
];

export function HeroSection() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [today, setToday] = useState<Date | undefined>(undefined);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities.filter((c) => c.popular));
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    if (destination.trim() === "") {
      setFilteredCities(cities.filter((c) => c.popular));
    } else {
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(destination.toLowerCase()) ||
          city.country.toLowerCase().includes(destination.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [destination]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (cityName: string) => {
    setDestination(cityName);
    setShowSuggestions(false);
  };

  const updateGuests = (
    type: "adults" | "children" | "rooms",
    increment: boolean
  ) => {
    setGuests((prev) => ({
      ...prev,
      [type]: increment
        ? prev[type] + 1
        : Math.max(type === "adults" || type === "rooms" ? 1 : 0, prev[type] - 1),
    }));
  };

  return (
    <section className="relative bg-primary pb-32 pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Find your next stay
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Search deals on hotels, homes, and much more...
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="rounded-xl bg-accent p-1 shadow-xl">
            <div className="grid gap-1 md:grid-cols-[1fr_auto_auto_auto]">
              {/* Destination */}
              <div className="relative">
                <div className="flex items-center rounded-lg bg-background px-4 py-3">
                  <MapPin className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="border-0 p-0 text-base shadow-none focus-visible:ring-0"
                    autoComplete="off"
                  />
                </div>
                {/* Autocomplete Suggestions */}
                {showSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-lg border bg-background shadow-lg"
                  >
                    {destination.trim() === "" && (
                      <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                        Popular Destinations
                      </div>
                    )}
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={`${city.name}-${city.country}`}
                          type="button"
                          className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-secondary"
                          onClick={() => handleSelectCity(city.name)}
                        >
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{city.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {city.country}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-muted-foreground">
                        No destinations found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Check-in Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg bg-background px-4 py-3 text-left transition-colors hover:bg-secondary">
                    <CalendarDays className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Check-in
                      </div>
                      <div className="text-sm font-medium">
                        {checkIn ? format(checkIn, "MMM d, yyyy") : "Add date"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => today ? date < today : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Check-out Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg bg-background px-4 py-3 text-left transition-colors hover:bg-secondary">
                    <CalendarDays className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Check-out
                      </div>
                      <div className="text-sm font-medium">
                        {checkOut
                          ? format(checkOut, "MMM d, yyyy")
                          : "Add date"}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) =>
                      (today ? date < today : false) || (checkIn ? date <= checkIn : false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Guests */}
              <div className="flex gap-1">
                <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex flex-1 items-center gap-3 rounded-lg bg-background px-4 py-3 text-left transition-colors hover:bg-secondary">
                      <Users className="h-5 w-5 shrink-0 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Guests
                        </div>
                        <div className="text-sm font-medium">
                          {guests.adults + guests.children} guests,{" "}
                          {guests.rooms} room
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72" align="end">
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Adults</div>
                          <div className="text-sm text-muted-foreground">
                            Ages 18+
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateGuests("adults", false)}
                            disabled={guests.adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">
                            {guests.adults}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateGuests("adults", true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Children</div>
                          <div className="text-sm text-muted-foreground">
                            Ages 0-17
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateGuests("children", false)}
                            disabled={guests.children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">
                            {guests.children}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateGuests("children", true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Rooms</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateGuests("rooms", false)}
                            disabled={guests.rooms <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{guests.rooms}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateGuests("rooms", true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => setGuestsOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <Button
                  size="lg"
                  className="h-auto rounded-lg bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
