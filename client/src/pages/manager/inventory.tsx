import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { analyzeInventory } from "@/lib/gemini";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, isBefore, addDays, parseISO, isValid } from "date-fns";
import { 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  Plus,
  ArrowUpDown,
  Check,
  ExternalLink,
  AlertTriangle,
  Calendar as CalendarIcon,
  RefreshCw,
  Truck,
  BarChart3,
  LayoutGrid,
  Sparkles,
  Loader2,
  Clock,
  XCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Types for our inventory system
interface InventoryItem {
  id: number;
  itemId: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'expiring_soon' | 'out_of_stock';
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NewInventoryItem {
  itemId: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'expiring_soon' | 'out_of_stock';
  expiryDate: string | null;
}

interface EditingItem {
  id: number;
  itemId: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'expiring_soon' | 'out_of_stock';
  expiryDate: string | null;
}

export default function ManagerInventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeadlinesDialogOpen, setIsDeadlinesDialogOpen] = useState(false);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{ isOpen: boolean, itemId: number | null }>({
    isOpen: false,
    itemId: null
  });
  
  // State for adding/editing items
  const [newItem, setNewItem] = useState<NewInventoryItem>({
    itemId: '',
    name: '',
    category: '',
    quantity: 0,
    location: '',
    status: 'in_stock',
    expiryDate: null
  });

  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Mock fetch inventory items
  const { data: inventoryItems, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/inventory', page, searchTerm, categoryFilter, locationFilter, statusFilter, activeTab],
    queryFn: async () => {
      // In a real app, we would fetch from the API with filters
      // return await apiRequest(`/api/inventory?page=${page}&search=${searchTerm}&category=${categoryFilter}&location=${locationFilter}&status=${statusFilter}`);
      
      // For demo, return mock data
      const mockItems: InventoryItem[] = [
        {
          id: 1,
          itemId: "INV-7845",
          name: "Smartphone XR-5",
          category: "Electronics",
          quantity: 28,
          location: "Warehouse A",
          status: "in_stock",
          expiryDate: null,
          createdAt: "2025-03-01T10:30:00.000Z",
          updatedAt: "2025-03-20T14:15:00.000Z"
        },
        {
          id: 2,
          itemId: "INV-7846",
          name: "Organic Apples",
          category: "Fresh Produce",
          quantity: 120,
          location: "Cold Storage A",
          status: "expiring_soon",
          expiryDate: "2025-03-28T00:00:00.000Z",
          createdAt: "2025-03-18T08:45:00.000Z",
          updatedAt: "2025-03-20T14:15:00.000Z"
        },
        {
          id: 3,
          itemId: "INV-7849",
          name: "Premium Office Chair",
          category: "Office Supplies",
          quantity: 12,
          location: "Warehouse B",
          status: "in_stock",
          expiryDate: null,
          createdAt: "2025-02-15T11:20:00.000Z",
          updatedAt: "2025-03-10T09:30:00.000Z"
        },
        {
          id: 4,
          itemId: "INV-7851",
          name: "Heavy Duty Drill",
          category: "Industrial Equipment",
          quantity: 5,
          location: "Warehouse A",
          status: "low_stock",
          expiryDate: null,
          createdAt: "2025-03-05T14:30:00.000Z",
          updatedAt: "2025-03-19T16:45:00.000Z"
        },
        {
          id: 5,
          itemId: "INV-7853",
          name: "Premium Notebooks",
          category: "Office Supplies",
          quantity: 210,
          location: "Warehouse B",
          status: "in_stock",
          expiryDate: null,
          createdAt: "2025-02-28T09:15:00.000Z",
          updatedAt: "2025-03-01T10:30:00.000Z"
        },
        {
          id: 6,
          itemId: "INV-7855",
          name: "Fresh Milk",
          category: "Dairy Products",
          quantity: 48,
          location: "Cold Storage A",
          status: "expiring_soon",
          expiryDate: "2025-03-27T00:00:00.000Z",
          createdAt: "2025-03-21T08:00:00.000Z",
          updatedAt: "2025-03-21T08:00:00.000Z"
        },
        {
          id: 7,
          itemId: "INV-7856",
          name: "LED Light Bulbs",
          category: "Electronics",
          quantity: 0,
          location: "Warehouse A",
          status: "out_of_stock",
          expiryDate: null,
          createdAt: "2025-02-10T13:20:00.000Z", 
          updatedAt: "2025-03-18T11:30:00.000Z"
        },
        {
          id: 8,
          itemId: "INV-7858",
          name: "Yogurt Cups",
          category: "Dairy Products",
          quantity: 72,
          location: "Cold Storage B",
          status: "expiring_soon",
          expiryDate: "2025-03-26T00:00:00.000Z",
          createdAt: "2025-03-19T07:45:00.000Z",
          updatedAt: "2025-03-19T07:45:00.000Z"
        }
      ];

      // Filter based on active tab
      let filtered = [...mockItems];
      
      if (activeTab === "expiring") {
        filtered = filtered.filter(item => item.status === "expiring_soon");
      } else if (activeTab === "low_stock") {
        filtered = filtered.filter(item => item.status === "low_stock" || item.status === "out_of_stock");
      }
      
      // Apply other filters
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(searchLower) || 
          item.itemId.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
        );
      }
      
      if (categoryFilter !== "all") {
        filtered = filtered.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());
      }
      
      if (locationFilter !== "all") {
        filtered = filtered.filter(item => item.location.toLowerCase().includes(locationFilter.toLowerCase()));
      }
      
      if (statusFilter !== "all") {
        filtered = filtered.filter(item => item.status === statusFilter);
      }
      
      // Simulate API delay
      return new Promise<InventoryItem[]>((resolve) => {
        setTimeout(() => resolve(filtered), 300);
      });
    }
  });

  // Mock query for expiring items
  const { data: expiringItems } = useQuery({
    queryKey: ['/api/inventory/expiring'],
    queryFn: async () => {
      // For demo, filter items that are expiring soon from our mock data
      const expiring = inventoryItems?.filter(item => item.status === "expiring_soon") || [];
      return expiring;
    },
    enabled: !!inventoryItems
  });

  // Mock create item mutation
  const createItemMutation = useMutation({
    mutationFn: async (item: NewInventoryItem) => {
      // In a real app, we would send this to the API
      // return await apiRequest('/api/inventory', { method: 'POST', data: item });
      
      // For demo, just log and return success after a delay
      console.log("Creating item:", item);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...item, id: Math.floor(Math.random() * 1000) };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      
      // Reset form and close dialog
      setNewItem({
        itemId: '',
        name: '',
        category: '',
        quantity: 0,
        location: '',
        status: 'in_stock',
        expiryDate: null
      });
      setIsAddItemOpen(false);
      
      toast({
        title: "Item Added",
        description: "The inventory item has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add inventory item. Please try again.",
      });
    }
  });

  // Mock update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async (item: EditingItem) => {
      // In a real app, we would send this to the API
      // return await apiRequest(`/api/inventory/${item.id}`, { method: 'PUT', data: item });
      
      // For demo, just log and return success after a delay
      console.log("Updating item:", item);
      await new Promise(resolve => setTimeout(resolve, 500));
      return item;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      
      // Reset form and close dialog
      setEditingItem(null);
      setIsEditItemOpen(false);
      
      toast({
        title: "Item Updated",
        description: "The inventory item has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update inventory item. Please try again.",
      });
    }
  });

  // Mock delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, we would send this to the API
      // return await apiRequest(`/api/inventory/${id}`, { method: 'DELETE' });
      
      // For demo, just log and return success after a delay
      console.log("Deleting item:", id);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      
      // Close confirm dialog
      setDeleteConfirmDialog({ isOpen: false, itemId: null });
      
      toast({
        title: "Item Deleted",
        description: "The inventory item has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete inventory item. Please try again.",
      });
    }
  });

  // Get AI analysis of inventory
  const handleGetAiAnalysis = async () => {
    if (!inventoryItems || inventoryItems.length === 0) return;
    
    setIsLoadingAnalysis(true);
    try {
      // Format inventory for analysis
      const formattedInventory = inventoryItems.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        status: item.status,
        expiryDate: item.expiryDate,
        location: item.location
      }));
      
      const analysis = await analyzeInventory(formattedInventory);
      setAiAnalysis(analysis);
      setIsAnalysisDialogOpen(true);
    } catch (error) {
      console.error("Error getting inventory analysis:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get AI analysis. Please try again.",
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Form handlers
  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItemMutation.mutate(newItem);
  };

  const handleEditItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItemMutation.mutate(editingItem);
    }
  };

  const handleDeleteItem = (id: number) => {
    setDeleteConfirmDialog({ isOpen: true, itemId: id });
  };

  const confirmDeleteItem = () => {
    if (deleteConfirmDialog.itemId !== null) {
      deleteItemMutation.mutate(deleteConfirmDialog.itemId);
    }
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem({
      id: item.id,
      itemId: item.itemId,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      location: item.location,
      status: item.status,
      expiryDate: item.expiryDate
    });
    setIsEditItemOpen(true);
  };

  // Format and display helpers
  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
    switch (status) {
      case "in_stock":
        return "default";
      case "low_stock":
        return "secondary";
      case "expiring_soon":
        return "outline";
      case "out_of_stock":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case "low_stock":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
      case "expiring_soon":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200";
      case "out_of_stock":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "in_stock":
        return "In Stock";
      case "low_stock":
        return "Low Stock";
      case "expiring_soon":
        return "Expiring Soon";
      case "out_of_stock":
        return "Out of Stock";
      default:
        return status;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    // Simple days difference calculation
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const formatExpiryDate = (expiryDate: string | null) => {
    if (!expiryDate) return "N/A";
    
    try {
      return format(new Date(expiryDate), "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    
    const daysLeft = getDaysUntilExpiry(expiryDate);
    
    if (daysLeft === null) return null;
    
    if (daysLeft < 0) {
      return {
        label: "Expired",
        class: "text-red-500 font-medium",
        urgent: true
      };
    } else if (daysLeft <= 2) {
      return {
        label: `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
        class: "text-red-500 font-medium",
        urgent: true
      };
    } else if (daysLeft <= 7) {
      return {
        label: `Expires in ${daysLeft} days`,
        class: "text-orange-500 font-medium",
        urgent: false
      };
    } else {
      return {
        label: `Expires in ${daysLeft} days`,
        class: "text-green-500 font-medium",
        urgent: false
      };
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={handleGetAiAnalysis}
            disabled={isLoadingAnalysis || !inventoryItems || inventoryItems.length === 0}
            className="flex items-center"
          >
            {isLoadingAnalysis ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            AI Analysis
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsDeadlinesDialogOpen(true)}
            className="flex items-center"
          >
            <Clock className="mr-2 h-4 w-4" />
            Deadlines
          </Button>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddItemSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new inventory item.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="item-id" className="text-right">
                      Item ID
                    </Label>
                    <Input 
                      id="item-id" 
                      className="col-span-3" 
                      value={newItem.itemId}
                      onChange={(e) => setNewItem({...newItem, itemId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input 
                      id="name" 
                      className="col-span-3" 
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({...newItem, category: value})}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Fresh Produce">Fresh Produce</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Industrial Equipment">Industrial Equipment</SelectItem>
                        <SelectItem value="Dairy Products">Dairy Products</SelectItem>
                        <SelectItem value="Bakery Goods">Bakery Goods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      className="col-span-3" 
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                      required
                      min={0}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Select
                      value={newItem.location}
                      onValueChange={(value) => setNewItem({...newItem, location: value})}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                        <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                        <SelectItem value="Cold Storage A">Cold Storage A</SelectItem>
                        <SelectItem value="Cold Storage B">Cold Storage B</SelectItem>
                        <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={newItem.status}
                      onValueChange={(value: 'in_stock' | 'low_stock' | 'expiring_soon' | 'out_of_stock') => 
                        setNewItem({...newItem, status: value})
                      }
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiry-date" className="text-right">
                      Expiry Date
                    </Label>
                    <div className="col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                              !newItem.expiryDate && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newItem.expiryDate ? format(new Date(newItem.expiryDate), "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newItem.expiryDate ? new Date(newItem.expiryDate) : undefined}
                            onSelect={(date) => 
                              setNewItem({
                                ...newItem, 
                                expiryDate: date ? date.toISOString() : null
                              })
                            }
                            initialFocus
                            disabled={(date) => isBefore(date, new Date())}
                          />
                          {newItem.expiryDate && (
                            <div className="flex items-center justify-center p-2 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setNewItem({...newItem, expiryDate: null})}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Clear date
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setIsAddItemOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createItemMutation.isPending}
                  >
                    {createItemMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Inventory Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring Soon
            {expiringItems && expiringItems.length > 0 && (
              <Badge variant="destructive" className="ml-2">{expiringItems.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Inventory Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Fresh Produce">Fresh Produce</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Industrial Equipment">Industrial Equipment</SelectItem>
                  <SelectItem value="Dairy Products">Dairy Products</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={locationFilter}
                onValueChange={setLocationFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                  <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  <SelectItem value="cold-storage-a">Cold Storage A</SelectItem>
                  <SelectItem value="cold-storage-b">Cold Storage B</SelectItem>
                  <SelectItem value="distribution-center">Distribution Center</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => refetch()}
                title="Refresh inventory data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <div className="flex items-center">
                    Item ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                      <p>Loading inventory data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                      <p>There was an error loading the inventory data.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => refetch()}
                      >
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : inventoryItems && inventoryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <p className="text-muted-foreground mb-2">No inventory items found.</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsAddItemOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Item
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                inventoryItems?.map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiryDate);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.itemId}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{item.location}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                          {formatStatus(item.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.expiryDate ? (
                          <div>
                            <div>{formatExpiryDate(item.expiryDate)}</div>
                            {expiryStatus && (
                              <div className={expiryStatus.class}>
                                {expiryStatus.label}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 mr-2"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                {[1, 2, 3].map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      isActive={page === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent>
          <form onSubmit={handleEditItemSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
              <DialogDescription>
                Update the details for this inventory item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-item-id" className="text-right">
                  Item ID
                </Label>
                <Input 
                  id="edit-item-id" 
                  className="col-span-3" 
                  value={editingItem?.itemId || ''}
                  onChange={(e) => editingItem && setEditingItem({...editingItem, itemId: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="edit-name" 
                  className="col-span-3" 
                  value={editingItem?.name || ''}
                  onChange={(e) => editingItem && setEditingItem({...editingItem, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={editingItem?.category || ''}
                  onValueChange={(value) => editingItem && setEditingItem({...editingItem, category: value})}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fresh Produce">Fresh Produce</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Industrial Equipment">Industrial Equipment</SelectItem>
                    <SelectItem value="Dairy Products">Dairy Products</SelectItem>
                    <SelectItem value="Bakery Goods">Bakery Goods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">
                  Quantity
                </Label>
                <Input 
                  id="edit-quantity" 
                  type="number" 
                  className="col-span-3" 
                  value={editingItem?.quantity || 0}
                  onChange={(e) => editingItem && setEditingItem({
                    ...editingItem, 
                    quantity: parseInt(e.target.value) || 0
                  })}
                  required
                  min={0}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Select
                  value={editingItem?.location || ''}
                  onValueChange={(value) => editingItem && setEditingItem({...editingItem, location: value})}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                    <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                    <SelectItem value="Cold Storage A">Cold Storage A</SelectItem>
                    <SelectItem value="Cold Storage B">Cold Storage B</SelectItem>
                    <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingItem?.status || 'in_stock'}
                  onValueChange={(value: 'in_stock' | 'low_stock' | 'expiring_soon' | 'out_of_stock') => 
                    editingItem && setEditingItem({...editingItem, status: value})
                  }
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expiry-date" className="text-right">
                  Expiry Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !editingItem?.expiryDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingItem?.expiryDate ? 
                          format(new Date(editingItem.expiryDate), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingItem?.expiryDate ? new Date(editingItem.expiryDate) : undefined}
                        onSelect={(date) => 
                          editingItem && setEditingItem({
                            ...editingItem, 
                            expiryDate: date ? date.toISOString() : null
                          })
                        }
                        initialFocus
                      />
                      {editingItem?.expiryDate && (
                        <div className="flex items-center justify-center p-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editingItem && setEditingItem({...editingItem, expiryDate: null})}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Clear date
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsEditItemOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateItemMutation.isPending}
              >
                {updateItemMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog.isOpen} onOpenChange={(open) => 
        setDeleteConfirmDialog({...deleteConfirmDialog, isOpen: open})
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inventory item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmDialog({isOpen: false, itemId: null})}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteItem}
              disabled={deleteItemMutation.isPending}
            >
              {deleteItemMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expiring Items Dialog */}
      <Dialog open={isDeadlinesDialogOpen} onOpenChange={setIsDeadlinesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Expiry Deadlines</DialogTitle>
            <DialogDescription>
              Items that are approaching their expiration dates.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {expiringItems && expiringItems.length > 0 ? (
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="grid grid-cols-7 p-3 bg-muted font-medium text-sm">
                    <div className="col-span-3">Item</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2 text-right">Expiry</div>
                  </div>
                  {expiringItems.map(item => {
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`grid grid-cols-7 p-3 border-t text-sm ${
                          expiryStatus?.urgent ? 'bg-red-50 dark:bg-red-900/10' : ''
                        }`}
                      >
                        <div className="col-span-3 font-medium">{item.name}</div>
                        <div className="col-span-2 text-muted-foreground">{item.location}</div>
                        <div className="col-span-2 text-right">
                          <div>{formatExpiryDate(item.expiryDate)}</div>
                          {expiryStatus && (
                            <div className={expiryStatus.class}>
                              {expiryStatus.label}
                              {expiryStatus.urgent && (
                                <AlertTriangle className="inline-block ml-1 h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Action Required</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        There are {expiringItems.length} items that will expire soon. Consider:
                      </p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside space-y-1">
                        <li>Adding these items to priority delivery routes</li>
                        <li>Offering discounted pricing on expiring products</li>
                        <li>Scheduling them for inspection before shipping</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Check className="h-10 w-10 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">No Expiring Items</p>
                <p className="text-muted-foreground">All of your inventory items are within safe expiry dates.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDeadlinesDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Analysis Dialog */}
      <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              AI Inventory Analysis
            </DialogTitle>
            <DialogDescription>
              Insights and recommendations based on your current inventory status.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto mt-4">
            {aiAnalysis ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: aiAnalysis.replace(/\n/g, '<br />') 
                }} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
                <p>Analyzing inventory data...</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAnalysisDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
