CREATE TABLE "Property" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "type" varchar,
  "location" varchar,
  "pricePerNight" decimal,
  "maxGuests" integer,
  "bedrooms" integer,
  "bathrooms" integer,
  "amenities" varchar[],
  "image" varchar
);

CREATE TABLE "Reservation" (
  "id" varchar PRIMARY KEY,
  "propertyId" varchar,
  "guestName" varchar,
  "guestEmail" varchar,
  "checkIn" date,
  "checkOut" date,
  "guests" integer,
  "totalPrice" decimal,
  "status" varchar,
  "createdAt" timestamp
);

CREATE TABLE "Module" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "description" varchar,
  "icon" varchar,
  "enabled" boolean,
  "route" varchar
);

CREATE TABLE "CalendarDay" (
  "date" date,
  "status" varchar,
  "propertyId" varchar,
  "reservationId" varchar,
  "price" decimal
);

ALTER TABLE "Reservation" ADD FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "CalendarDay" ADD FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "CalendarDay" ADD FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") DEFERRABLE INITIALLY IMMEDIATE;
