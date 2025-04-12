import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  unit: string;
  nutrition?: NutritionInfo;
  origin: string;
  organic: boolean;
}

const initialForm: ProductForm = {
  name: "",
  description: "",
  price: 0,
  category: "Fruits",
  images: [],
  stock: 0,
  unit: "kg",
  origin: "",
  organic: false,
};

export function AddProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [imageUrl, setImageUrl] = useState("");
  const [showNutrition, setShowNutrition] = useState(false);
  const addProduct = useMutation(api.products.add);
  const { toast } = useToast();

  const handleAddImage = () => {
    if (imageUrl && imageUrl.startsWith("http")) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product image",
        variant: "destructive",
      });
      return;
    }

    try {
      await addProduct(form);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
      >
        Add New Product
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Herbs">Herbs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Unit
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className="flex-1 p-2 border rounded-lg"
                  min="0"
                  step="0.01"
                  required
                />
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-24 p-2 border rounded-lg"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="piece">piece</option>
                  <option value="bunch">bunch</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Image
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {form.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origin
              </label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., California, USA"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={form.organic}
                onChange={(e) => setForm({ ...form, organic: e.target.checked })}
                className="h-4 w-4 text-green-600"
                id="organic"
              />
              <label htmlFor="organic" className="ml-2 text-sm text-gray-700">
                Organic Product
              </label>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowNutrition(!showNutrition)}
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${showNutrition ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Nutrition Information (Optional)
            </button>

            {showNutrition && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={form.nutrition?.calories ?? ""}
                    onChange={(e) => setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        calories: parseFloat(e.target.value),
                        protein: form.nutrition?.protein ?? 0,
                        carbs: form.nutrition?.carbs ?? 0,
                        fat: form.nutrition?.fat ?? 0,
                      },
                    })}
                    className="w-full p-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={form.nutrition?.protein ?? ""}
                    onChange={(e) => setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        protein: parseFloat(e.target.value),
                        calories: form.nutrition?.calories ?? 0,
                        carbs: form.nutrition?.carbs ?? 0,
                        fat: form.nutrition?.fat ?? 0,
                      },
                    })}
                    className="w-full p-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={form.nutrition?.carbs ?? ""}
                    onChange={(e) => setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        carbs: parseFloat(e.target.value),
                        calories: form.nutrition?.calories ?? 0,
                        protein: form.nutrition?.protein ?? 0,
                        fat: form.nutrition?.fat ?? 0,
                      },
                    })}
                    className="w-full p-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={form.nutrition?.fat ?? ""}
                    onChange={(e) => setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        fat: parseFloat(e.target.value),
                        calories: form.nutrition?.calories ?? 0,
                        protein: form.nutrition?.protein ?? 0,
                        carbs: form.nutrition?.carbs ?? 0,
                      },
                    })}
                    className="w-full p-2 border rounded-lg"
                    min="0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
