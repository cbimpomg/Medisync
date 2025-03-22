/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Pill, Plus, Minus, Heart, Package, ArrowLeft } from 'lucide-react';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import Invoice from '@/components/pharmacy/Invoice';
import { paystackService } from '@/lib/services/paystackService';
import { useAuth } from '@/hooks/useAuth';
import { medicationService } from '@/lib/services/medicationService';

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

interface CartItem {
  id: string;
  medication: Medication;
  quantity: number;
}

const PharmacyComponent = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <PatientSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <PharmacyContent />
      </div>
    </div>
  );
};

const PharmacyContent = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const prescribedMed = location.state?.prescribedMedication;
    if (prescribedMed) {
      const medication = medications.find(med => 
        med.name.toLowerCase() === prescribedMed.name.toLowerCase() && 
        med.dosage === prescribedMed.dosage
      );
      
      if (medication) {
        setCart([{ id: medication.id || '', medication, quantity: prescribedMed.quantity }]);
        setShowCart(true);
        toast({
          title: "Prescription Added",
          description: `${medication.name} has been added to your cart.`
        });
      }
    }
  }, [location.state, medications, toast]);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = new URLSearchParams(location.search).get('reference');
      if (reference) {
        try {
          const response = await paystackService.verifyTransaction(reference);
          if (response.status && response.data.status === 'success') {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            setOrderDetails({
              reference: reference,
              date: new Date().toLocaleDateString(),
              items: cartItems,
              total: cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
              paymentStatus: 'success',
              deliveryStatus: 'processing'
            });
            setShowInvoice(true);
            localStorage.removeItem('cartItems');
            setCart([]);
          }
        } catch (error) {
          toast({
            title: 'Payment Verification Failed',
            description: 'There was an error verifying your payment.',
            variant: 'destructive'
          });
        }
      }
    };

    verifyPayment();
  }, [location.search, toast]);

  const { user } = useAuth();
  const handleCheckout = async () => {
    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive"
      });
      return;
    }

    const checkoutItems = cart.map(item => ({
      medicationId: item.id,
      quantity: item.quantity,
      name: item.medication.name,
      price: item.medication.discountPrice || item.medication.price
    }));
    
    const total = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const reference = `ORDER_${Date.now()}`;
    
    try {
      const response = await paystackService.initializeTransaction({
        email: user.email,
        amount: total * 100,
        reference,
        callback_url: window.location.href,
        metadata: {
          cart_items: checkoutItems
        }
      });

      if (response.status && response.data.authorization_url) {
        localStorage.setItem('cartItems', JSON.stringify(checkoutItems));
        localStorage.setItem('orderTotal', total.toString());
        localStorage.setItem('paymentReference', response.data.reference);
        window.location.href = response.data.authorization_url;
      }
    } catch (error) {
      toast({
        title: 'Checkout Failed',
        description: 'Unable to initialize payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    const unsubscribe = medicationService.subscribeToMedications((updatedMedications) => {
      setMedications(updatedMedications);
    });

    return () => unsubscribe();
  }, []);

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
    if (medication.requiresPrescription && !location.state?.prescribedMedication) {
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
    <div className="container mx-auto px-4 py-8">
      {showInvoice && orderDetails ? (
        <Invoice orderDetails={orderDetails} onClose={() => setShowInvoice(false)} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">E-Pharmacy</h1>
              <Button
                variant="outline"
                className="relative"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">Order medications and health products online</p>
            </div>
            <div className="bg-white/90 rounded-xl shadow-xl p-6">
              {showCart ? (
                <div className="animate-fade-in">
                  {/* Cart content */}
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
                              <p className="font-semibold">₵{((item.medication.discountPrice || item.medication.price) * item.quantity).toFixed(2)}</p>
                              {item.medication.discountPrice && (
                                <p className="text-sm text-gray-500 line-through">₵{(item.medication.price * item.quantity).toFixed(2)}</p>
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
                    
                    <div className="mt-6 p-6 bg-gray-50 rounded-xl shadow-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">₵{calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Shipping</span>
                          <span className="font-medium">₵5.99</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Tax (7%)</span>
                          <span className="font-medium">₵{(calculateTotal() * 0.07).toFixed(2)}</span>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-blue-600">₵{(calculateTotal() + 5.99 + (calculateTotal() * 0.07)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 px-6 bg-gray-50 rounded-xl">
                    <ShoppingCart className="h-20 w-20 mx-auto text-gray-300 mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-3">Your cart is empty</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Browse our wide selection of medications and health products to get started</p>
                    <Button 
                      onClick={() => setShowCart(false)}
                      className="bg-medisync-primary hover:bg-medisync-secondary text-white px-8 py-2 rounded-full shadow-sm"
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
                      </div>
                    </div>
                  </Tabs>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-64 shrink-0">
                    <div className="sticky top-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-lg mb-4">Categories</h3>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div 
                            key={category.id} 
                            className={`px-4 py-2.5 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                              categoryFilter === category.id 
                                ? 'bg-medisync-primary text-white font-medium shadow-sm' 
                                : 'hover:bg-medisync-accent/50'
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredMedications.length > 0 ? (
                        filteredMedications.map(medication => (
                          <Card key={medication.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-48 bg-gray-50 relative flex items-center justify-center">
                              <Pill className="h-20 w-20 text-blue-500/40" />
                              {!medication.inStock && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                  <span className="text-white font-medium">Out of Stock</span>
                                </div>
                              )}
                              {medication.discountPrice && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                                  Save ₵{(medication.price - medication.discountPrice).toFixed(2)}
                                </div>
                              )}
                            </div>
                            <CardContent className="p-5">
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-lg leading-tight mb-1">{medication.name}</h3>
                                    <p className="text-sm text-gray-600">{medication.generic}</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-gray-400 hover:text-red-500 -mt-1"
                                  >
                                    <Heart className="h-5 w-5" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-gray-600">{medication.dosage} {medication.dosageForm}</p>
                                  {medication.requiresPrescription ? (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 whitespace-nowrap">
                                      Prescription Required
                                    </Badge>
                                  ) : (
                                    <div className="flex-shrink-0">{renderStarRating(medication.rating)}</div>
                                  )}
                                </div>
                              
                              <div className="pt-4 mt-3 border-t">
                                <div className="flex items-center justify-between">
                                  <div>
                                    {medication.discountPrice ? (
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-semibold text-blue-600">₵{medication.discountPrice.toFixed(2)}</span>
                                        <span className="text-sm text-gray-400 line-through">₵{medication.price.toFixed(2)}</span>
                                      </div>
                                    ) : (
                                      <span className="text-xl font-semibold text-medisync-primary">₵{medication.price.toFixed(2)}</span>
                                    )}
                                  </div>
                                  
                                  <Button 
                                    className="bg-medisync-primary hover:bg-medisync accent/50 text-white shadow-sm"
                                    disabled={!medication.inStock || medication.requiresPrescription}
                                    onClick={() => addToCart(medication)}
                                  >
                                    {medication.requiresPrescription ? 'View Prescription' : 'Add to Cart'}
                                  </Button>
                              </div>
                              </div>
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
      )}
    </div>
  );
}

export default PharmacyComponent;