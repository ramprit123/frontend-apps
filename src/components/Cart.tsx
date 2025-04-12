import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Cart() {
  const cart = useQuery(api.cart.getCart) ?? [];
  const total = cart.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      <div className="hidden group-hover:block absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-lg border p-6">
        {cart.length === 0 ? (
          <div className="text-center py-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item._id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.product?.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">${((item.product?.price ?? 0) * item.quantity).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
