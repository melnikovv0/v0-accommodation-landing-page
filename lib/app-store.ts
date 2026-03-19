import { create } from "zustand";
import { properties, reservations } from "./mock-data";
import type { Property, Reservation } from "./mock-data";

export interface SearchFilters {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
}

export interface AppStore {
  // Data
  properties: Property[];
  reservations: Reservation[];
  searchFilters: SearchFilters;
  selectedPropertyId: string | null;

  // Search actions
  setSearchFilters: (filters: SearchFilters) => void;
  resetSearchFilters: () => void;
  filteredProperties: () => Property[];

  // Property actions
  setSelectedProperty: (id: string | null) => void;
  getPropertyById: (id: string) => Property | undefined;

  // Booking actions
  createBooking: (
    propertyId: string,
    guestName: string,
    guestEmail: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number
  ) => Reservation;

  // Property management (for owners)
  addProperty: (property: Omit<Property, "id">) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  // Reservation management
  updateReservationStatus: (
    id: string,
    status: "confirmed" | "pending" | "cancelled"
  ) => void;
  cancelReservation: (id: string) => void;
}

const initialSearchFilters: SearchFilters = {
  destination: "",
  checkIn: null,
  checkOut: null,
  guests: {
    adults: 2,
    children: 0,
    rooms: 1,
  },
};

export const useAppStore = create<AppStore>((set, get) => ({
  properties: [...properties],
  reservations: [...reservations],
  searchFilters: initialSearchFilters,
  selectedPropertyId: null,

  setSearchFilters: (filters: SearchFilters) =>
    set({ searchFilters: filters }),

  resetSearchFilters: () =>
    set({ searchFilters: initialSearchFilters }),

  filteredProperties: () => {
    const { properties: props, searchFilters } = get();
    return props.filter((property) => {
      // Filter by destination (searches in location and name)
      if (searchFilters.destination.trim()) {
        const search = searchFilters.destination.toLowerCase();
        const matchesLocation = property.location
          .toLowerCase()
          .includes(search);
        const matchesName = property.name.toLowerCase().includes(search);
        if (!matchesLocation && !matchesName) return false;
      }

      // Filter by max guests
      const totalGuests =
        searchFilters.guests.adults + searchFilters.guests.children;
      if (totalGuests > property.maxGuests) return false;

      // Filter by date availability
      if (searchFilters.checkIn && searchFilters.checkOut) {
        const { reservations: res } = get();
        const hasConflict = res.some(
          (reservation) =>
            reservation.propertyId === property.id &&
            reservation.status !== "cancelled" &&
            !(
              searchFilters.checkOut <= reservation.checkIn ||
              searchFilters.checkIn >= reservation.checkOut
            )
        );
        if (hasConflict) return false;
      }

      return true;
    });
  },

  setSelectedProperty: (id: string | null) =>
    set({ selectedPropertyId: id }),

  getPropertyById: (id: string) => {
    const { properties: props } = get();
    return props.find((p) => p.id === id);
  },

  createBooking: (
    propertyId: string,
    guestName: string,
    guestEmail: string,
    checkIn: Date,
    checkOut: Date,
    guests: number,
    totalPrice: number
  ) => {
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      propertyId,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: "confirmed",
      createdAt: new Date(),
    };

    set((state) => ({
      reservations: [...state.reservations, newReservation],
    }));

    return newReservation;
  },

  addProperty: (property: Omit<Property, "id">) => {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
    };

    set((state) => ({
      properties: [...state.properties, newProperty],
    }));

    return newProperty;
  },

  updateProperty: (id: string, updates: Partial<Property>) => {
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  deleteProperty: (id: string) => {
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    }));
  },

  updateReservationStatus: (
    id: string,
    status: "confirmed" | "pending" | "cancelled"
  ) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    }));
  },

  cancelReservation: (id: string) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, status: "cancelled" } : r
      ),
    }));
  },
}));
