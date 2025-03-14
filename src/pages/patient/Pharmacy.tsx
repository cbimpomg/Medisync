import { useState } from 'react';
import { ShoppingCart, Search, Filter, Pill, Plus, Minus, Heart, Package, ArrowLeft } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  generic: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  requiresPrescription: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  dosage: string;
  dosageForm: string;
}

interface CartItem {
  id: string;
  medication: Medication;
  quantity: number;
}

const Pharmacy = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Mock medication data
  const medications: Medication[] = [
    {
      id: '1',
      name: 'Tylenol Extra Strength',
      generic: 'Acetaminophen',
      description: 'Pain reliever and fever reducer.',
      price: 8.99,
      category: 'pain-relief',
      imageUrl: '/images/placeholder.svg',
      requiresPrescription: false,
      inStock: true,
      rating: 4.5,
      reviews: 128,
      dosage: '500mg',
      dosageForm: 'Tablet'
    },
    {
      id: '2',
      name: 'Advil',
      generic: 'Ibuprofen',
      description: 'Relieves minor aches and pains.',
      price: 9.99,
      discountPrice: 7.99,
      category: 'pain-relief',
      imageUrl: '/images/placeholder.svg',
      requiresPrescription: false,
      inStock: true,
      rating: 4.7,
      reviews: 95,
      dosage: '200mg',
      dosageForm: 'Caplet'
    },
    {
      id: '3',
      name: 'Zyrtec',
      generic: 'Cetirizine',
      description: '24-hour allergy relief.',
      price: 24.99,
      category: 'allergy',
      imageUrl: '/images/placeholder.svg',
      requiresPrescription: false,
      inStock: true,
      rating: 4.8,
      reviews: 76,
      dosage: '10mg',
      dosageForm: 'Tablet'
    },
    {
      id: '4',
      name: 'Lipitor',
      generic: 'Atorvastatin',
      description: 'Cholesterol management medication.',
      price: 58.99,
      category: 'prescription',
      imageUrl: '/images/placeholder.svg',
      requiresPrescription: true,
      inStock: true,
      rating: 4.6,
      reviews: 205,
      dosage: '20mg',
      dosageForm: 'Tablet'
    }
  ];

  // Filter medications based on search and category
  const filteredMedications = medications.filter(medication => {
    const matchesSearch = 
      medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.generic.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (categoryFilter !== 'all') {
      matchesCategory = medication.category === categoryFilter;
    }
    
    let matchesTab = true;
    if (activeTab === 'prescription') {
      matchesTab = medication.requiresPrescription;
    } else if (activeTab === 'otc') {
      matchesTab = !medication.requiresPrescription;
    }
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'pain-relief', name: 'Pain Relief' },
    { id: 'allergy', name: 'Allergy & Sinus' },
    { id: 'prescription', name: 'Prescription Medications' }
  ];

  const addToCart = (medication: Medication) => {
    if (medication.requiresPrescription) {
      toast({
        title: "Prescription Required",
        description: "Please check your prescriptions section.",
        variant: "destructive"
      });
      return;
    }
    
    const existingItem = cart.find(item => item.id === medication.id);
    
    if (existingItem) {
      setCart(
        cart.map(item => 
          item.id === medication.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCart([...cart, { id: medication.id, medication, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${medication.name} has been added to your cart.`
    });
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(
      cart.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.medication.discountPrice || item.medication.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            {i < fullStars ? '★' : (i === fullStars && hasHalfStar ? '★' : '☆')}
          </span>
        ))}
        <span className="ml-1 text-xs text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ 
        backgroundImage: 'url("/images/blur-hospital.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <PatientSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-6 flex-1 overflow-y-auto relative z-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">E-Pharmacy</h1>
            <p className="text-white drop-shadow-md mt-2">Order medications and health products online</p>
          </div>
          
          <div className="bg-white/90 rounded-xl shadow-xl p-6">
            {showCart ? (
              <div className="animate-fade-in">
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-2"
                    onClick={() => setShowCart(false)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shopping
                  </Button>
                  <h2 className="text-2xl font-semibold">Your Cart</h2>
                </div>
            
                {cart.length > 0 ? (
                  <div>
                    {cart.map(item => (
                      <Card key={item.id} className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                              <Pill className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.medication.name}</h3>
                              <p className="text-sm text-gray-600">{item.medication.dosage} {item.medication.dosageForm}</p>
                            </div>
                            <div className="flex items-center mx-4">
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="mx-3">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right mr-4">
                              <p className="font-semibold">${((item.medication.discountPrice || item.medication.price) * item.quantity).toFixed(2)}</p>
                              {item.medication.discountPrice && (
                                <p className="text-sm text-gray-500 line-through">${(item.medication.price * item.quantity).toFixed(2)}</p>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Shipping</span>
                        <span>$5.99</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Tax</span>
                        <span>${(calculateTotal() * 0.07).toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(calculateTotal() + 5.99 + (calculateTotal() * 0.07)).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add medications or health products to get started</p>
                    <Button 
                      onClick={() => setShowCart(false)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <TabsList>
                        <TabsTrigger value="all">All Products</TabsTrigger>
                        <TabsTrigger value="otc">Over-the-Counter</TabsTrigger>
                        <TabsTrigger value="prescription">Prescription</TabsTrigger>
                      </TabsList>
                      
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="Search medications..." 
                            className="pl-10 w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="relative"
                          onClick={() => setShowCart(true)}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                              {cart.length}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Tabs>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-56 shrink-0">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h3 className="font-semibold mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div 
                            key={category.id} 
                            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              categoryFilter === category.id 
                                ? 'bg-blue-100 text-blue-600 font-medium' 
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setCategoryFilter(category.id)}
                          >
                            {category.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMedications.length > 0 ? (
                        filteredMedications.map(medication => (
                          <Card key={medication.id} className="overflow-hidden">
                            <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                              <Pill className="h-16 w-16 text-blue-500/30" />
                              {!medication.inStock && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white font-medium">Out of Stock</span>
                                </div>
                              )}
                              {medication.discountPrice && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  Save ${(medication.price - medication.discountPrice).toFixed(2)}
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{medication.name}</h3>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gray-400 hover:text-red-500"
                                >
                                  <Heart className="h-5 w-5" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{medication.generic}</p>
                              <p className="text-sm text-gray-600 mb-3">{medication.dosage} {medication.dosageForm}</p>
                              
                              <div className="mb-3">
                                {medication.requiresPrescription ? (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    Prescription Required
                                  </Badge>
                                ) : (
                                  renderStarRating(medication.rating)
                                )}
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <div>
                                  {medication.discountPrice ? (
                                    <div>
                                      <span className="text-lg font-semibold">${medication.discountPrice.toFixed(2)}</span>
                                      <span className="text-sm text-gray-500 line-through ml-2">${medication.price.toFixed(2)}</span>
                                    </div>
                                  ) : (
                                    <span className="text-lg font-semibold">${medication.price.toFixed(2)}</span>
                                  )}
                                </div>
                                
                                <Button 
                                  className="bg-blue-500 hover:bg-blue-600 text-white"
                                  disabled={!medication.inStock || medication.requiresPrescription}
                                  onClick={() => addToCart(medication)}
                                >
                                  {medication.requiresPrescription ? 'View Prescription' : 'Add to Cart'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-700">No Products Found</h3>
                          <p className="text-gray-500 max-w-sm mx-auto mt-2">
                            Try adjusting your search or filters to find what you're looking for.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery('');
                              setCategoryFilter('all');
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy; 