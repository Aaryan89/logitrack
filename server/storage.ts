import { 
  users, packages, trucks, inventory, routes, events,
  type User, type InsertUser,
  type Package, type InsertPackage,
  type Truck, type InsertTruck,
  type Inventory, type InsertInventory,
  type Route, type InsertRoute,
  type Event, type InsertEvent
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Package operations
  getPackage(id: number): Promise<Package | undefined>;
  getPackageByPackageId(packageId: string): Promise<Package | undefined>;
  getPackages(): Promise<Package[]>;
  getPackagesByTruck(truckId: string): Promise<Package[]>;
  createPackage(packageData: InsertPackage): Promise<Package>;
  updatePackage(id: number, packageData: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;
  
  // Truck operations
  getTruck(id: number): Promise<Truck | undefined>;
  getTruckByTruckId(truckId: string): Promise<Truck | undefined>;
  getTrucks(): Promise<Truck[]>;
  getTrucksByStatus(status: string): Promise<Truck[]>;
  getTrucksByDriver(driverId: number): Promise<Truck[]>;
  createTruck(truckData: InsertTruck): Promise<Truck>;
  updateTruck(id: number, truckData: Partial<InsertTruck>): Promise<Truck | undefined>;
  deleteTruck(id: number): Promise<boolean>;
  
  // Inventory operations
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  getInventoryItemByItemId(itemId: string): Promise<Inventory | undefined>;
  getInventory(): Promise<Inventory[]>;
  getInventoryByLocation(location: string): Promise<Inventory[]>;
  getInventoryByStatus(status: string): Promise<Inventory[]>;
  createInventoryItem(inventoryData: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, inventoryData: Partial<InsertInventory>): Promise<Inventory | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  
  // Route operations
  getRoute(id: number): Promise<Route | undefined>;
  getRouteByRouteId(routeId: string): Promise<Route | undefined>;
  getRoutes(): Promise<Route[]>;
  getRoutesByTruck(truckId: string): Promise<Route[]>;
  getRoutesByStatus(status: string): Promise<Route[]>;
  createRoute(routeData: InsertRoute): Promise<Route>;
  updateRoute(id: number, routeData: Partial<InsertRoute>): Promise<Route | undefined>;
  deleteRoute(id: number): Promise<boolean>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  getEventsByType(type: string): Promise<Event[]>;
  getEventsByRelatedId(relatedId: string): Promise<Event[]>;
  getEventsByDateRange(start: Date, end: Date): Promise<Event[]>;
  createEvent(eventData: InsertEvent): Promise<Event>;
  updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private trucks: Map<number, Truck>;
  private inventoryItems: Map<number, Inventory>;
  private routes: Map<number, Route>;
  private events: Map<number, Event>;
  
  private userCurrentId: number;
  private packageCurrentId: number;
  private truckCurrentId: number;
  private inventoryCurrentId: number;
  private routeCurrentId: number;
  private eventCurrentId: number;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.trucks = new Map();
    this.inventoryItems = new Map();
    this.routes = new Map();
    this.events = new Map();
    
    this.userCurrentId = 1;
    this.packageCurrentId = 1;
    this.truckCurrentId = 1;
    this.inventoryCurrentId = 1;
    this.routeCurrentId = 1;
    this.eventCurrentId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  private async initializeSampleData() {
    // Create sample users
    await this.createUser({
      username: "driver1",
      password: "password",
      email: "driver1@example.com",
      name: "John Driver",
      role: "driver"
    });
    
    await this.createUser({
      username: "manager1",
      password: "password",
      email: "manager1@example.com",
      name: "Sarah Manager",
      role: "manager"
    });
    
    // Create sample trucks
    await this.createTruck({
      truckId: "TRUCK-001",
      model: "Volvo FH16",
      license: "XYZ-1234",
      status: "available",
      assignedDriver: 1,
      capacity: 2000,
      currentCapacity: 1500
    });
    
    await this.createTruck({
      truckId: "TRUCK-002",
      model: "Mercedes Actros",
      license: "ABC-5678",
      status: "in_transit",
      capacity: 1800,
      currentCapacity: 1200
    });
    
    // Create sample inventory items
    await this.createInventoryItem({
      itemId: "ITEM-001",
      name: "Fresh Produce",
      category: "Perishable",
      quantity: 500,
      location: "Warehouse A",
      status: "in_stock",
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    await this.createInventoryItem({
      itemId: "ITEM-002",
      name: "Electronics",
      category: "Non-Perishable",
      quantity: 200,
      location: "Warehouse B",
      status: "in_stock"
    });
    
    await this.createInventoryItem({
      itemId: "ITEM-003",
      name: "Dairy Products",
      category: "Perishable",
      quantity: 150,
      location: "TRUCK-001",
      status: "in_transit",
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    });
    
    // Create sample packages
    await this.createPackage({
      packageId: "PKG-001",
      description: "Fragile Electronics",
      destination: "123 Main St, New York, NY",
      status: "in_transit",
      priority: "high",
      assignedTruck: "TRUCK-001",
      stopNumber: 1
    });
    
    await this.createPackage({
      packageId: "PKG-002",
      description: "Food Delivery",
      destination: "456 Elm St, Los Angeles, CA",
      status: "pending",
      priority: "medium"
    });
    
    // Create sample routes
    await this.createRoute({
      routeId: "ROUTE-001",
      startLocation: "Warehouse A, Chicago, IL",
      endLocation: "Distribution Center, Detroit, MI",
      stops: [
        { location: "123 Main St, New York, NY", arrivalTime: new Date(), departureTime: new Date(), status: "pending" },
        { location: "456 Oak Ave, Philadelphia, PA", arrivalTime: new Date(), departureTime: new Date(), status: "pending" }
      ],
      assignedTruck: "TRUCK-001",
      status: "in_progress",
      estimatedDuration: 480, // 8 hours
      distance: 450, // km
      startTime: new Date()
    });
    
    // Create sample events
    await this.createEvent({
      title: "Truck Maintenance",
      description: "Regular maintenance for TRUCK-001",
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
      allDay: false,
      type: "maintenance",
      relatedId: "TRUCK-001"
    });
    
    await this.createEvent({
      title: "Big Shipment Arrival",
      description: "Large shipment arriving at Warehouse A",
      start: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 5 hours duration
      allDay: false,
      type: "shipment",
      relatedId: "WAREHOUSE-A"
    });
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      lastLogin: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Package Methods
  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }
  
  async getPackageByPackageId(packageId: string): Promise<Package | undefined> {
    return Array.from(this.packages.values()).find(
      (pkg) => pkg.packageId === packageId,
    );
  }
  
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }
  
  async getPackagesByTruck(truckId: string): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(
      (pkg) => pkg.assignedTruck === truckId,
    );
  }
  
  async createPackage(packageData: InsertPackage): Promise<Package> {
    const id = this.packageCurrentId++;
    const newPackage: Package = { 
      ...packageData, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.packages.set(id, newPackage);
    return newPackage;
  }
  
  async updatePackage(id: number, packageData: Partial<InsertPackage>): Promise<Package | undefined> {
    const existingPackage = this.packages.get(id);
    if (!existingPackage) return undefined;
    
    const updatedPackage: Package = { 
      ...existingPackage, 
      ...packageData, 
      updatedAt: new Date() 
    };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }
  
  async deletePackage(id: number): Promise<boolean> {
    return this.packages.delete(id);
  }
  
  // Truck Methods
  async getTruck(id: number): Promise<Truck | undefined> {
    return this.trucks.get(id);
  }
  
  async getTruckByTruckId(truckId: string): Promise<Truck | undefined> {
    return Array.from(this.trucks.values()).find(
      (truck) => truck.truckId === truckId,
    );
  }
  
  async getTrucks(): Promise<Truck[]> {
    return Array.from(this.trucks.values());
  }
  
  async getTrucksByStatus(status: string): Promise<Truck[]> {
    return Array.from(this.trucks.values()).filter(
      (truck) => truck.status === status,
    );
  }
  
  async getTrucksByDriver(driverId: number): Promise<Truck[]> {
    return Array.from(this.trucks.values()).filter(
      (truck) => truck.assignedDriver === driverId,
    );
  }
  
  async createTruck(truckData: InsertTruck): Promise<Truck> {
    const id = this.truckCurrentId++;
    const newTruck: Truck = { 
      ...truckData, 
      id,
      lastMaintenance: new Date()
    };
    this.trucks.set(id, newTruck);
    return newTruck;
  }
  
  async updateTruck(id: number, truckData: Partial<InsertTruck>): Promise<Truck | undefined> {
    const existingTruck = this.trucks.get(id);
    if (!existingTruck) return undefined;
    
    const updatedTruck: Truck = { 
      ...existingTruck, 
      ...truckData
    };
    this.trucks.set(id, updatedTruck);
    return updatedTruck;
  }
  
  async deleteTruck(id: number): Promise<boolean> {
    return this.trucks.delete(id);
  }
  
  // Inventory Methods
  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    return this.inventoryItems.get(id);
  }
  
  async getInventoryItemByItemId(itemId: string): Promise<Inventory | undefined> {
    return Array.from(this.inventoryItems.values()).find(
      (item) => item.itemId === itemId,
    );
  }
  
  async getInventory(): Promise<Inventory[]> {
    return Array.from(this.inventoryItems.values());
  }
  
  async getInventoryByLocation(location: string): Promise<Inventory[]> {
    return Array.from(this.inventoryItems.values()).filter(
      (item) => item.location === location,
    );
  }
  
  async getInventoryByStatus(status: string): Promise<Inventory[]> {
    return Array.from(this.inventoryItems.values()).filter(
      (item) => item.status === status,
    );
  }
  
  async createInventoryItem(inventoryData: InsertInventory): Promise<Inventory> {
    const id = this.inventoryCurrentId++;
    const newItem: Inventory = { 
      ...inventoryData, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inventoryItems.set(id, newItem);
    return newItem;
  }
  
  async updateInventoryItem(id: number, inventoryData: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const existingItem = this.inventoryItems.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem: Inventory = { 
      ...existingItem, 
      ...inventoryData, 
      updatedAt: new Date() 
    };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }
  
  // Route Methods
  async getRoute(id: number): Promise<Route | undefined> {
    return this.routes.get(id);
  }
  
  async getRouteByRouteId(routeId: string): Promise<Route | undefined> {
    return Array.from(this.routes.values()).find(
      (route) => route.routeId === routeId,
    );
  }
  
  async getRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }
  
  async getRoutesByTruck(truckId: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(
      (route) => route.assignedTruck === truckId,
    );
  }
  
  async getRoutesByStatus(status: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(
      (route) => route.status === status,
    );
  }
  
  async createRoute(routeData: InsertRoute): Promise<Route> {
    const id = this.routeCurrentId++;
    const newRoute: Route = { 
      ...routeData, 
      id,
      actualDuration: null,
      endTime: null,
      createdAt: new Date()
    };
    this.routes.set(id, newRoute);
    return newRoute;
  }
  
  async updateRoute(id: number, routeData: Partial<InsertRoute>): Promise<Route | undefined> {
    const existingRoute = this.routes.get(id);
    if (!existingRoute) return undefined;
    
    const updatedRoute: Route = { 
      ...existingRoute, 
      ...routeData
    };
    this.routes.set(id, updatedRoute);
    return updatedRoute;
  }
  
  async deleteRoute(id: number): Promise<boolean> {
    return this.routes.delete(id);
  }
  
  // Event Methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEventsByType(type: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.type === type,
    );
  }
  
  async getEventsByRelatedId(relatedId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.relatedId === relatedId,
    );
  }
  
  async getEventsByDateRange(start: Date, end: Date): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.start >= start && event.end <= end,
    );
  }
  
  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const newEvent: Event = { 
      ...eventData, 
      id
    };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent: Event = { 
      ...existingEvent, 
      ...eventData
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
}

export const storage = new MemStorage();
