import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface Vendor {
  _id: Id<"vendors">;
  _creationTime: number;
  name: string;
  description: string;
  logo: string;
  address: string;
  userId: Id<"users">;
  rating: number;
  isVerified: boolean;
}

interface Product {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  isNew: boolean;
  vendorId: Id<"vendors">;
  unit: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  origin: string;
  organic: boolean;
  vendor: Vendor | null;
}

export function ProductList() {
  const products = useQuery(api.products.list) ?? [];
  const addToCart = useMutation(api.cart.addToCart);
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCart = async (productId: Id<"products">) => {
    try {
      await addToCart({ productId, quantity: 1 });
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product: Product) => (
          <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-56 object-cover cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              />
              {product.isNew && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {product.organic && (
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Organic
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                <span className="text-green-600 font-bold text-xl">${product.price.toFixed(2)}/{product.unit}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {product.vendor && (
                  <>
                    <img
                      src={product.vendor.logo}
                      alt={product.vendor.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{product.vendor.name}</span>
                    {product.vendor.isVerified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    )}
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{product.stock} in stock</span>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedProduct.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-green-600">
                    ${selectedProduct.price.toFixed(2)}/{selectedProduct.unit}
                  </span>
                  <span className="text-gray-500">{selectedProduct.stock} in stock</span>
                </div>

                {selectedProduct.vendor && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Vendor Information</h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedProduct.vendor.logo}
                        alt={selectedProduct.vendor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{selectedProduct.vendor.name}</p>
                        <p className="text-sm text-gray-600">{selectedProduct.vendor.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProduct.nutrition && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Nutrition Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Calories</p>
                        <p className="font-semibold">{selectedProduct.nutrition.calories} kcal</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Protein</p>
                        <p className="font-semibold">{selectedProduct.nutrition.protein}g</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Carbs</p>
                        <p className="font-semibold">{selectedProduct.nutrition.carbs}g</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Fat</p>
                        <p className="font-semibold">{selectedProduct.nutrition.fat}g</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(selectedProduct._id)}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
