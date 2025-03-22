import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Timestamp } from 'firebase/firestore';
import { medicationService } from '@/lib/services/medicationService';
import { useToast } from "@/components/ui/use-toast";

interface Medication {
  id?: string;
  name: string;
  generic: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  requiresPrescription: boolean;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  dosage: string;
  dosageForm: string;
  manufacturer: string;
  expiryDate: Date;
}

const medicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  generic: z.string().min(1, "Generic name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0, "Discount price must be positive").optional(),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  requiresPrescription: z.boolean(),
  stockQuantity: z.number().min(0, "Stock quantity must be positive"),
  dosage: z.string().min(1, "Dosage is required"),
  dosageForm: z.string().min(1, "Dosage form is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  expiryDate: z.date()
});

export function MedicationManagement() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof medicationSchema>>({    
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      generic: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "",
      imageUrl: "",
      requiresPrescription: false,
      stockQuantity: 0,
      dosage: "",
      dosageForm: "",
      manufacturer: "",
      expiryDate: new Date()
    }
  });

  useEffect(() => {
    const unsubscribe = medicationService.subscribeToMedications((updatedMedications) => {
      setMedications(updatedMedications);
    });

    return () => unsubscribe();
  }, []);

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof medicationSchema>) => {
    try {
      const medicationData: Omit<Medication, 'id'> = {
        name: values.name,
        generic: values.generic,
        description: values.description,
        price: values.price,
        discountPrice: values.discountPrice,
        category: values.category,
        imageUrl: values.imageUrl,
        requiresPrescription: values.requiresPrescription,
        inStock: true,
        stockQuantity: values.stockQuantity,
        rating: 0,
        reviews: 0,
        dosage: values.dosage,
        dosageForm: values.dosageForm,
        manufacturer: values.manufacturer,
        expiryDate: values.expiryDate
      };
      
      await medicationService.addMedication(medicationData);
      toast({
        title: "Success",
        description: "Medication added successfully"
      });
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medication Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Medication</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="generic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Generic Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₵)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value === 0 ? '0' : field.value || ''}
                            onChange={e => field.onChange(e.target.valueAsNumber || 0)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Price (₵)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value === 0 ? '0' : field.value || ''}
                            onChange={e => field.onChange(e.target.valueAsNumber || 0)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="painkillers">Painkillers</SelectItem>
                            <SelectItem value="antibiotics">Antibiotics</SelectItem>
                            <SelectItem value="vitamins">Vitamins</SelectItem>
                            <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value === 0 ? '0' : field.value || ''}
                            onChange={e => field.onChange(e.target.valueAsNumber || 0)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dosageForm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage Form</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dosage form" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tablet">Tablet</SelectItem>
                            <SelectItem value="capsule">Capsule</SelectItem>
                            <SelectItem value="liquid">Liquid</SelectItem>
                            <SelectItem value="injection">Injection</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiresPrescription"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Requires Prescription</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Medication</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Prescription Required</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell>{medication.name}</TableCell>
              <TableCell>{medication.category}</TableCell>
              <TableCell>₵{medication.price}</TableCell>
              <TableCell>{medication.stockQuantity}</TableCell>
              <TableCell>{medication.requiresPrescription ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => {
                    form.reset(medication);
                    setIsAddDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await medicationService.deleteMedication(medication.id!);
                      toast({
                        title: "Success",
                        description: "Medication deleted successfully"
                      });
                    } catch (error) {
                      console.error('Error deleting medication:', error);
                      toast({
                        title: "Error",
                        description: "Failed to delete medication",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}