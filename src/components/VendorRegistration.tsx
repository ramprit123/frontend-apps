import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";

export function VendorRegistration() {
  const [isOpen, setIsOpen] = useState(false);
  const register = useMutation(api.vendors.register);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      toast({
        title: "Success",
        description: "Your vendor account has been created",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create vendor account",
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
        Become a Vendor
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Register as a Vendor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex gap-4 pt-4">
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
