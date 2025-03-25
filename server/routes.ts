import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertPackageSchema, insertTruckSchema, insertInventorySchema, insertRouteSchema, insertEventSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  // All routes should be prefixed with /api
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/by-username/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user by username:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Package routes
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const packageId = req.params.id;
      const packageItem = await storage.getPackage(packageId);
      
      if (!packageItem) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(packageItem);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/packages", async (req, res) => {
    try {
      const validatedData = insertPackageSchema.parse(req.body);
      const newPackage = await storage.createPackage(validatedData);
      res.status(201).json(newPackage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      console.error("Error creating package:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/packages/:id", async (req, res) => {
    try {
      const packageId = req.params.id;
      const validatedData = insertPackageSchema.partial().parse(req.body);
      const updatedPackage = await storage.updatePackage(packageId, validatedData);
      
      if (!updatedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(updatedPackage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      console.error("Error updating package:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/packages/by-truck/:truckId", async (req, res) => {
    try {
      const truckId = req.params.truckId;
      const packages = await storage.getPackagesByTruck(truckId);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages by truck:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Truck routes
  app.get("/api/trucks", async (req, res) => {
    try {
      const trucks = await storage.getAllTrucks();
      res.json(trucks);
    } catch (error) {
      console.error("Error fetching trucks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/trucks/:id", async (req, res) => {
    try {
      const truckId = req.params.id;
      const truck = await storage.getTruck(truckId);
      
      if (!truck) {
        return res.status(404).json({ message: "Truck not found" });
      }
      
      res.json(truck);
    } catch (error) {
      console.error("Error fetching truck:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/trucks", async (req, res) => {
    try {
      const validatedData = insertTruckSchema.parse(req.body);
      const newTruck = await storage.createTruck(validatedData);
      res.status(201).json(newTruck);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid truck data", errors: error.errors });
      }
      console.error("Error creating truck:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/trucks/:id", async (req, res) => {
    try {
      const truckId = req.params.id;
      const validatedData = insertTruckSchema.partial().parse(req.body);
      const updatedTruck = await storage.updateTruck(truckId, validatedData);
      
      if (!updatedTruck) {
        return res.status(404).json({ message: "Truck not found" });
      }
      
      res.json(updatedTruck);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid truck data", errors: error.errors });
      }
      console.error("Error updating truck:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/trucks/by-driver/:driverId", async (req, res) => {
    try {
      const driverId = parseInt(req.params.driverId);
      const truck = await storage.getTruckByDriver(driverId);
      
      if (!truck) {
        return res.status(404).json({ message: "No truck assigned to this driver" });
      }
      
      res.json(truck);
    } catch (error) {
      console.error("Error fetching truck by driver:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getAllInventory();
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const itemId = req.params.id;
      const item = await storage.getInventoryItem(itemId);
      
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventorySchema.parse(req.body);
      const newItem = await storage.createInventoryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory data", errors: error.errors });
      }
      console.error("Error creating inventory item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const itemId = req.params.id;
      const validatedData = insertInventorySchema.partial().parse(req.body);
      const updatedItem = await storage.updateInventoryItem(itemId, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory data", errors: error.errors });
      }
      console.error("Error updating inventory item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      const itemId = req.params.id;
      const deleted = await storage.deleteInventoryItem(itemId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/inventory/expiring", async (req, res) => {
    try {
      const expiringItems = await storage.getExpiringInventory();
      res.json(expiringItems);
    } catch (error) {
      console.error("Error fetching expiring inventory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Route routes
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/routes/:id", async (req, res) => {
    try {
      const routeId = req.params.id;
      const route = await storage.getRoute(routeId);
      
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      
      res.json(route);
    } catch (error) {
      console.error("Error fetching route:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/routes", async (req, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const newRoute = await storage.createRoute(validatedData);
      res.status(201).json(newRoute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid route data", errors: error.errors });
      }
      console.error("Error creating route:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/routes/:id", async (req, res) => {
    try {
      const routeId = req.params.id;
      const validatedData = insertRouteSchema.partial().parse(req.body);
      const updatedRoute = await storage.updateRoute(routeId, validatedData);
      
      if (!updatedRoute) {
        return res.status(404).json({ message: "Route not found" });
      }
      
      res.json(updatedRoute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid route data", errors: error.errors });
      }
      console.error("Error updating route:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/routes/by-truck/:truckId", async (req, res) => {
    try {
      const truckId = req.params.truckId;
      const routes = await storage.getRoutesByTruck(truckId);
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes by truck:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/routes/optimize", async (req, res) => {
    try {
      // This would normally call the Gemini API for route optimization
      // For now, we'll simulate an optimized response
      const { routeIds } = req.body;
      
      if (!routeIds || !Array.isArray(routeIds)) {
        return res.status(400).json({ message: "Invalid request. Expected array of route IDs." });
      }
      
      // Simulate processing time (would be async call to Gemini API)
      setTimeout(async () => {
        try {
          const optimizedRoutes = await storage.getOptimizedRoutes(routeIds);
          res.json(optimizedRoutes);
        } catch (error) {
          console.error("Error in route optimization:", error);
          res.status(500).json({ message: "Internal server error during optimization" });
        }
      }, 1000);
    } catch (error) {
      console.error("Error in route optimization request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const validatedData = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(eventId, validatedData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const deleted = await storage.deleteEvent(eventId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/events/by-date", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const events = await storage.getEventsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching events by date:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Email organization endpoint (using Gemini AI)
  app.post("/api/emails/organize", async (req, res) => {
    try {
      const { emails } = req.body;
      
      if (!emails || !Array.isArray(emails)) {
        return res.status(400).json({ message: "Invalid request. Expected array of emails." });
      }
      
      // Simulate AI processing time (would be async call to Gemini API)
      setTimeout(async () => {
        try {
          const organizedEmails = await storage.getOrganizedEmails(emails);
          res.json(organizedEmails);
        } catch (error) {
          console.error("Error in email organization:", error);
          res.status(500).json({ message: "Internal server error during email organization" });
        }
      }, 1500);
    } catch (error) {
      console.error("Error in email organization request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
