import { CategoryFilter } from "@/components/CategoryFilter";
import { SignInForm } from "@/SignInForm";
import { useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProductList } from "./ProductList";
import { AddProductForm } from "./AddProductForm";

export function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const vendorProfile = useQuery(api.vendors.getMyVendorProfile);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-12">
          Fresh from Local Vendors
        </h1>
        <Authenticated>
          {vendorProfile ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={vendorProfile.logo}
                  alt={vendorProfile.name}
                  className="w-16 h-16 rounded-full object-cover" />
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-800">{vendorProfile.name}</h2>
                  <p className="text-gray-600">{vendorProfile.description}</p>
                </div>
              </div>
              <AddProductForm />
            </div>
          ) : (
            <p className="text-xl text-gray-600 mb-8 hidden">
              Welcome back, {loggedInUser?.email ?? "friend"}! Browse our fresh selection below.
            </p>
          )}
          <CategoryFilter />
          <ProductList />
        </Authenticated>
        <Unauthenticated>
          <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md mx-auto">
            <p className="text-xl text-gray-600 mb-8">Sign in to start shopping fresh produce</p>
            <SignInForm />
          </div>
        </Unauthenticated>
      </div>
    </div>
  );
}
