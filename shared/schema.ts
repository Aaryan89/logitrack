import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email").unique(),
  googleId: text("google_id").unique(),
  name: text("name"),
  role: text("role").notNull().default("driver"), // "driver" or "manager"
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// Package model
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  packageId: text("package_id").notNull().unique(),
  description: text("description").notNull(),
  destination: text("destination").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_transit, delivered
  priority: text("priority").notNull().default("medium"), // low, medium, high
  assignedTruck: text("assigned_truck"),
  stopNumber: integer("stop_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Truck model
export const trucks = pgTable("trucks", {
  id: serial("id").primaryKey(),
  truckId: text("truck_id").notNull().unique(),
  model: text("model"),
  license: text("license"),
  status: text("status").notNull().default("available"), // available, in_transit, maintenance
  assignedDriver: integer("assigned_driver").references(() => users.id),
  capacity: integer("capacity"),
  currentCapacity: integer("current_capacity"),
  lastMaintenance: timestamp("last_maintenance"),
});

// Inventory model
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemId: text("item_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("in_stock"), // in_stock, low_stock, out_of_stock, expiring_soon
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Route model
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  routeId: text("route_id").notNull().unique(),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  stops: jsonb("stops").notNull(), // array of locations with details
  assignedTruck: text("assigned_truck"),
  status: text("status").notNull().default("planned"), // planned, in_progress, completed
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDuration: integer("actual_duration"), // in minutes
  distance: integer("distance"), // in kilometers
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event model for calendar
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  allDay: boolean("all_day").default(false),
  type: text("type").notNull(), // shipment, departure, audit, meeting
  relatedId: text("related_id"), // can be truckId, routeId, etc.
});

// Define insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  googleId: true,
  name: true,
  role: true,
  profilePicture: true,
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  packageId: true,
  description: true,
  destination: true,
  status: true,
  priority: true,
  assignedTruck: true,
  stopNumber: true,
});

export const insertTruckSchema = createInsertSchema(trucks).pick({
  truckId: true,
  model: true,
  license: true,
  status: true,
  assignedDriver: true,
  capacity: true,
  currentCapacity: true,
});

export const insertInventorySchema = createInsertSchema(inventory).pick({
  itemId: true,
  name: true,
  category: true,
  quantity: true,
  location: true,
  status: true,
  expiryDate: true,
});

export const insertRouteSchema = createInsertSchema(routes).pick({
  routeId: true,
  startLocation: true,
  endLocation: true,
  stops: true,
  assignedTruck: true,
  status: true,
  estimatedDuration: true,
  distance: true,
  startTime: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  start: true,
  end: true,
  allDay: true,
  type: true,
  relatedId: true,
});

// Define types for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertTruck = z.infer<typeof insertTruckSchema>;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;

// Define select types
export type User = typeof users.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Truck = typeof trucks.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Event = typeof events.$inferSelect;
