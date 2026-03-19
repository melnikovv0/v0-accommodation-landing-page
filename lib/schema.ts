/**
 * Database Schema Interfaces
 * These TypeScript interfaces document the data structure
 * that will be used when migrating to PostgreSQL.
 */

// User roles in the system
export type UserRole = "guest" | "owner" | "admin";

// Users table - stores all user accounts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Property types
export type PropertyType = "apartment" | "house" | "villa" | "studio";

// Properties table - stores all accommodation listings
export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  location: string;
  address?: string;
  description?: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[]; // Will be JSONB in PostgreSQL
  images: string[]; // Will be JSONB in PostgreSQL
  ownerId: string; // Foreign key to Users
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Reservation status
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

// Reservations table - stores all bookings
export interface Reservation {
  id: string;
  propertyId: string; // Foreign key to Properties
  guestId: string; // Foreign key to Users
  guestName: string; // Denormalized for quick access
  guestEmail: string; // Denormalized for quick access
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: ReservationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Module configuration for the modular system
export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  route: string;
  order: number;
  permissions?: string[]; // Which roles can access
}

// Financial records for tracking revenue
export interface FinancialRecord {
  id: string;
  propertyId: string;
  reservationId?: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

// Maintenance tasks for property upkeep
export interface MaintenanceTask {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed";
  assignedTo?: string; // Employee ID
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Employee records
export interface Employee {
  id: string;
  userId: string; // Links to User account
  role: string;
  department: string;
  salary?: number;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Calendar availability (for complex pricing/blocking)
export interface CalendarEntry {
  id: string;
  propertyId: string;
  date: Date;
  status: "available" | "occupied" | "maintenance" | "blocked";
  price?: number; // Override price for this date
  reservationId?: string;
  notes?: string;
}

/**
 * PostgreSQL Schema Notes:
 *
 * CREATE TABLE users (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   name VARCHAR(255) NOT NULL,
 *   role VARCHAR(20) NOT NULL DEFAULT 'guest',
 *   avatar_url TEXT,
 *   phone VARCHAR(50),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * CREATE TABLE properties (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name VARCHAR(255) NOT NULL,
 *   type VARCHAR(50) NOT NULL,
 *   location VARCHAR(255) NOT NULL,
 *   address TEXT,
 *   description TEXT,
 *   price_per_night DECIMAL(10,2) NOT NULL,
 *   max_guests INTEGER NOT NULL,
 *   bedrooms INTEGER NOT NULL,
 *   bathrooms INTEGER NOT NULL,
 *   amenities JSONB DEFAULT '[]',
 *   images JSONB DEFAULT '[]',
 *   owner_id UUID REFERENCES users(id),
 *   is_active BOOLEAN DEFAULT true,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * CREATE TABLE reservations (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   property_id UUID REFERENCES properties(id),
 *   guest_id UUID REFERENCES users(id),
 *   guest_name VARCHAR(255) NOT NULL,
 *   guest_email VARCHAR(255) NOT NULL,
 *   check_in DATE NOT NULL,
 *   check_out DATE NOT NULL,
 *   guests INTEGER NOT NULL,
 *   total_price DECIMAL(10,2) NOT NULL,
 *   status VARCHAR(20) NOT NULL DEFAULT 'pending',
 *   notes TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * Indexes:
 * - CREATE INDEX idx_reservations_property ON reservations(property_id);
 * - CREATE INDEX idx_reservations_dates ON reservations(check_in, check_out);
 * - CREATE INDEX idx_properties_location ON properties(location);
 * - CREATE INDEX idx_properties_owner ON properties(owner_id);
 */
