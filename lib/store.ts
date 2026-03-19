import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  properties as initialProperties,
  reservations as initialReservations,
  modules as initialModules,
  type Property,
  type Reservation,
  type Module,
} from "./mock-data";

// Search filters interface
export interface SearchFilters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

// UI state interface
export interface UIState {
  sidebarCollapsed: boolean;
  bookingModalOpen: boolean;
  selectedPropertyId: string | null;
}

// Main store state interface
export interface StoreState {
  // Data
  properties: Property[];
  reservations: Reservation[];
  modules: Module[];

  // Search
  searchFilters: SearchFilters;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchFilters: () => void;
  getFilteredProperties: () => Property[];

  // Reservations
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt">) => void;
  updateReservationStatus: (
    id: string,
    status: Reservation["status"]
  ) => void;
  getPropertyReservations: (propertyId: string) => Reservation[];
  checkAvailability: (
    propertyId: string,
    checkIn: Date,
    checkOut: Date
  ) => boolean;

  // Modules
  updateModuleStatus: (moduleId: string, enabled: boolean) => void;
  getEnabledModules: () => Module[];

  // UI
  ui: UIState;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openBookingModal: (propertyId: string) => void;
  closeBookingModal: () => void;
}

// Default search filters
const defaultSearchFilters: SearchFilters = {
  location: "",
  checkIn: null,
  checkOut: null,
  guests: 1,
};

// Default UI state
const defaultUIState: UIState = {
  sidebarCollapsed: false,
  bookingModalOpen: false,
  selectedPropertyId: null,
};

// Create the store with persistence for modules
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial data from mock-data
      properties: initialProperties,
      reservations: initialReservations,
      modules: initialModules,

      // Search state
      searchFilters: defaultSearchFilters,

      setSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        })),

      clearSearchFilters: () =>
        set({ searchFilters: defaultSearchFilters }),

      getFilteredProperties: () => {
        const { properties, searchFilters } = get();
        const { location, checkIn, checkOut, guests } = searchFilters;

        return properties.filter((property) => {
          // Filter by location (case-insensitive partial match)
          if (location && location.trim() !== "") {
            const locationLower = location.toLowerCase();
            const propertyLocation = property.location.toLowerCase();
            const propertyName = property.name.toLowerCase();
            if (
              !propertyLocation.includes(locationLower) &&
              !propertyName.includes(locationLower)
            ) {
              return false;
            }
          }

          // Filter by guest capacity
          if (guests > property.maxGuests) {
            return false;
          }

          // Filter by availability (if dates are provided)
          if (checkIn && checkOut) {
            const isAvailable = get().checkAvailability(
              property.id,
              checkIn,
              checkOut
            );
            if (!isAvailable) {
              return false;
            }
          }

          return true;
        });
      },

      // Reservation actions
      addReservation: (reservation) =>
        set((state) => {
          const newReservation: Reservation = {
            ...reservation,
            id: `res-${Date.now()}`,
            createdAt: new Date(),
          };
          return {
            reservations: [...state.reservations, newReservation],
          };
        }),

      updateReservationStatus: (id, status) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      getPropertyReservations: (propertyId) => {
        return get().reservations.filter((r) => r.propertyId === propertyId);
      },

      checkAvailability: (propertyId, checkIn, checkOut) => {
        const reservations = get().reservations.filter(
          (r) => r.propertyId === propertyId && r.status !== "cancelled"
        );

        for (const reservation of reservations) {
          // Check if date ranges overlap
          const resCheckIn = new Date(reservation.checkIn);
          const resCheckOut = new Date(reservation.checkOut);

          if (checkIn < resCheckOut && checkOut > resCheckIn) {
            return false; // Overlap found
          }
        }

        return true; // No overlap, available
      },

      // Module actions
      updateModuleStatus: (moduleId, enabled) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId ? { ...m, enabled } : m
          ),
        })),

      getEnabledModules: () => {
        return get().modules.filter((m) => m.enabled);
      },

      // UI state
      ui: defaultUIState,

      setSidebarCollapsed: (collapsed) =>
        set((state) => ({
          ui: { ...state.ui, sidebarCollapsed: collapsed },
        })),

      openBookingModal: (propertyId) =>
        set((state) => ({
          ui: {
            ...state.ui,
            bookingModalOpen: true,
            selectedPropertyId: propertyId,
          },
        })),

      closeBookingModal: () =>
        set((state) => ({
          ui: {
            ...state.ui,
            bookingModalOpen: false,
            selectedPropertyId: null,
          },
        })),
    }),
    {
      name: "stayhub-storage",
      // Only persist modules state (not search filters or UI state)
      partialize: (state) => ({
        modules: state.modules,
        reservations: state.reservations,
      }),
    }
  )
);

// Selector hooks for better performance
export const useSearchFilters = () => useStore((state) => state.searchFilters);
export const useProperties = () => useStore((state) => state.properties);
export const useReservations = () => useStore((state) => state.reservations);
export const useModules = () => useStore((state) => state.modules);
export const useUI = () => useStore((state) => state.ui);
