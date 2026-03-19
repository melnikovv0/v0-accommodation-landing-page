# StayHub UIS - PostgreSQL Schema Documentation

## Overview
This document describes the PostgreSQL database schema for the StayHub Unified Information System (UIS). The schema is designed to support a complete accommodation booking platform with multi-role support (guests, property owners, admins) and modular feature management.

---

## Database Schema

### 1. Users Table
Stores user account information for all roles (guest, owner, admin).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('guest', 'owner', 'admin')),
  phone_number VARCHAR(20),
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `email`: User's email address (unique)
- `password_hash`: Bcrypt-hashed password
- `first_name` / `last_name`: User's name
- `role`: User role (guest, owner, admin)
- `phone_number`: Contact phone number
- `profile_image_url`: URL to profile picture
- `bio`: Short user biography
- `created_at` / `updated_at`: Timestamps
- `is_active`: Account status

---

### 2. Properties Table
Stores accommodation listings created by property owners.

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('apartment', 'house', 'villa', 'studio', 'condo', 'bungalow')),
  location VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_per_night DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL CHECK (max_guests > 0),
  bedrooms INTEGER NOT NULL CHECK (bedrooms > 0),
  bathrooms INTEGER NOT NULL CHECK (bathrooms > 0),
  image_url TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  amenities TEXT[] NOT NULL,
  rating DECIMAL(3, 1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_owner_id (owner_id),
  INDEX idx_location (location),
  INDEX idx_price_per_night (price_per_night),
  INDEX idx_is_published (is_published)
);
```

**Fields:**
- `id`: Unique property identifier
- `owner_id`: Reference to property owner (users table)
- `name`: Property name/title
- `description`: Full property description
- `type`: Accommodation type
- `location`: City/region (searchable)
- `address`: Full address
- `latitude` / `longitude`: Geolocation coordinates
- `price_per_night`: Nightly rate in USD
- `max_guests`: Maximum occupancy
- `bedrooms` / `bathrooms`: Room counts
- `image_url`: Main property image
- `gallery_images`: Array of gallery image URLs
- `amenities`: Array of amenity strings (WiFi, Pool, etc.)
- `rating` / `review_count`: Review metrics
- `is_published`: Publication status
- `created_at` / `updated_at`: Timestamps

---

### 3. Reservations Table
Stores all booking records for properties.

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  special_requests TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_dates CHECK (check_out_date > check_in_date),
  INDEX idx_property_id (property_id),
  INDEX idx_guest_id (guest_id),
  INDEX idx_status (status),
  INDEX idx_check_in_date (check_in_date),
  INDEX idx_check_out_date (check_out_date)
);
```

**Fields:**
- `id`: Unique reservation identifier
- `property_id`: Reference to property
- `guest_id`: Reference to guest user
- `check_in_date` / `check_out_date`: Booking dates
- `number_of_guests`: Actual guests staying
- `total_price`: Total accommodation cost
- `service_fee`: Platform service fee
- `status`: Booking status (pending, confirmed, cancelled, completed)
- `payment_status`: Payment status
- `special_requests`: Guest requests/notes
- `cancellation_reason`: Reason for cancellation
- `created_at` / `updated_at`: Timestamps

---

### 4. Reviews Table
Stores guest reviews and ratings for properties.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_property_id (property_id),
  INDEX idx_guest_id (guest_id),
  INDEX idx_rating (rating)
);
```

**Fields:**
- `id`: Unique review identifier
- `property_id`: Reference to property
- `reservation_id`: Reference to completed reservation
- `guest_id`: Reference to reviewer
- `rating`: Overall rating (1-5 stars)
- `comment`: Review text
- `*_rating`: Specific category ratings
- `created_at` / `updated_at`: Timestamps

---

### 5. Availability Calendar Table
Tracks property availability and pricing by date.

```sql
CREATE TABLE availability_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  calendar_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'blocked', 'maintenance')),
  price_override DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(property_id, calendar_date),
  INDEX idx_property_id (property_id),
  INDEX idx_calendar_date (calendar_date),
  INDEX idx_status (status)
);
```

**Fields:**
- `id`: Unique identifier
- `property_id`: Reference to property
- `calendar_date`: Date being tracked
- `status`: Availability status (available, occupied, blocked, maintenance)
- `price_override`: Optional custom pricing for this date
- `notes`: Additional notes
- `created_at` / `updated_at`: Timestamps

---

### 6. Financial Transactions Table
Tracks all financial transactions for owners and the platform.

```sql
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('booking_revenue', 'refund', 'payout', 'platform_fee')),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_reservation_id (reservation_id),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

**Fields:**
- `id`: Unique transaction identifier
- `user_id`: Reference to user
- `reservation_id`: Optional reference to reservation
- `transaction_type`: Type of transaction
- `amount`: Transaction amount
- `currency`: Currency code
- `status`: Transaction status
- `payment_method`: Payment method used
- `description`: Transaction details
- `created_at` / `updated_at`: Timestamps

---

### 7. Modules Table
Stores configuration for modular system features.

```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  icon_name VARCHAR(50),
  route VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_module_key (module_key),
  INDEX idx_is_enabled (is_enabled)
);
```

**Fields:**
- `id`: Unique module identifier
- `module_key`: Internal module identifier
- `name`: Module display name
- `description`: Module description
- `is_enabled`: Enable/disable flag
- `icon_name`: Icon identifier
- `route`: Module route path
- `created_at` / `updated_at`: Timestamps

---

### 8. Maintenance Requests Table
For maintenance tracking (part of optional maintenance module).

```sql
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  INDEX idx_property_id (property_id),
  INDEX idx_priority (priority),
  INDEX idx_status (status)
);
```

---

## Key Relationships

```
users (1) --- (many) properties
users (1) --- (many) reservations
users (1) --- (many) reviews
users (1) --- (many) financial_transactions
users (1) --- (many) maintenance_requests

properties (1) --- (many) reservations
properties (1) --- (many) reviews
properties (1) --- (many) availability_calendar
properties (1) --- (many) maintenance_requests

reservations (1) --- (many) reviews
reservations (1) --- (many) financial_transactions
```

---

## Indexes and Performance

All tables include strategic indexes on:
- Foreign keys (for JOIN operations)
- Frequently filtered columns (status, dates, role)
- Columns used in WHERE clauses

This ensures optimal query performance for common operations.

---

## Row Level Security (RLS) Policies

When using PostgreSQL with Supabase, implement these RLS policies:

### Users Table
- Authenticated users can only view/update their own profile
- Admins can view all profiles

### Properties Table
- Anyone can view published properties
- Owners can view/edit their own properties
- Admins can manage all properties

### Reservations Table
- Guests can view their own reservations
- Owners can view reservations for their properties
- Admins can view all reservations

### Financial Transactions Table
- Users can only view their own transactions
- Admins can view all transactions

---

## Migration Path from Current State

The frontend currently uses Zustand store with mock data. To migrate to PostgreSQL:

1. Install database driver: `npm install pg` or use Supabase client
2. Create migration files in `scripts/migrations/`
3. Update API routes to query database instead of mock data
4. Update Zustand store to fetch from database
5. Implement proper error handling and caching
6. Add database transactions for critical operations

---

## Example Queries

### Find available properties by location and dates
```sql
SELECT p.* FROM properties p
LEFT JOIN availability_calendar ac ON p.id = ac.property_id
  AND ac.calendar_date BETWEEN $1 AND $2
  AND ac.status != 'available'
WHERE p.location ILIKE $3 AND p.is_published = true
  AND ac.id IS NULL
  AND p.price_per_night BETWEEN $4 AND $5
ORDER BY p.rating DESC;
```

### Calculate owner revenue
```sql
SELECT 
  u.id, 
  u.first_name, 
  u.last_name,
  SUM(CASE WHEN ft.transaction_type = 'booking_revenue' THEN ft.amount ELSE 0 END) as total_revenue,
  COUNT(DISTINCT r.id) as total_bookings
FROM users u
LEFT JOIN properties p ON u.id = p.owner_id
LEFT JOIN reservations r ON p.id = r.property_id AND r.status = 'completed'
LEFT JOIN financial_transactions ft ON r.id = ft.reservation_id
WHERE u.role = 'owner'
GROUP BY u.id;
```

### Get property ratings summary
```sql
SELECT 
  p.id,
  p.name,
  AVG(r.rating) as avg_rating,
  COUNT(r.id) as review_count,
  AVG(r.cleanliness_rating) as avg_cleanliness,
  AVG(r.communication_rating) as avg_communication
FROM properties p
LEFT JOIN reviews r ON p.id = r.property_id
GROUP BY p.id;
```

---

## Future Enhancements

- Implement full-text search on properties
- Add booking history archival for analytics
- Create audit logs table for compliance
- Add messaging/communication table for guest-owner interaction
- Implement wishlists/favorites table
- Add discount codes and promotions table
