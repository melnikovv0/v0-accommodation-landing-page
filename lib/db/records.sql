
-- 1. PROPERTIES (Nemovitosti)
INSERT INTO "Property" (id, name, type, location, pricePerNight, maxGuests, bedrooms, bathrooms, image) VALUES 
('prop-1', 'Seaside Luxury Apartment', 'apartment', 'Miami Beach, FL', 250, 4, 2, 2, 'https://images.unsplash.com'),
('prop-2', 'Mountain View Villa', 'villa', 'Aspen, CO', 450, 8, 4, 3, 'https://images.unsplash.com'),
('prop-3', 'Downtown Studio Loft', 'studio', 'New York, NY', 180, 2, 1, 1, 'https://images.unsplash.com');

-- 2. RESERVATIONS (Rezervace)
INSERT INTO "Reservation" (id, propertyId, guestName, guestEmail, checkIn, checkOut, guests, totalPrice, status, createdAt) VALUES 
('res-1', 'prop-1', 'John Smith', 'john@example.com', '2026-03-15', '2026-03-20', 2, 1250, 'confirmed', '2026-03-01'),
('res-2', 'prop-2', 'Jane Doe', 'jane@example.com', '2026-03-22', '2026-03-25', 4, 1350, 'pending', '2026-03-05'),
('res-3', 'prop-3', 'Mike Johnson', 'mike@test.com', '2026-04-10', '2026-04-12', 1, 360, 'cancelled', '2026-03-10');

-- 3. MODULES (Moduly systemu)
INSERT INTO "Module" (id, name, description, icon, enabled, route) VALUES 
('dashboard', 'Owner Dashboard', 'Property overview and analytics', 'LayoutDashboard', true, '/admin/dashboard'),
('properties', 'Property Management', 'Add, edit and manage listings', 'Building2', true, '/admin/properties'),
('maintenance', 'Maintenance', 'Property upkeep tracking', 'Wrench', true, '/admin/maintenance');

-- 4. CALENDAR DAYS (Ukazka kalendare)
INSERT INTO "CalendarDay" (date, status, propertyId, reservationId, price) VALUES 
('2026-03-15', 'occupied', 'prop-1', 'res-1', NULL),
('2026-03-16', 'occupied', 'prop-1', 'res-1', NULL),
('2026-03-28', 'maintenance', 'prop-1', NULL, NULL);