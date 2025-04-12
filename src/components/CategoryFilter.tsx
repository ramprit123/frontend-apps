
export function CategoryFilter() {
  const categories = ["All", "Fruits", "Vegetables", "Herbs"];

  return (
    <div className="flex justify-center gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          className="px-6 py-2 rounded-full bg-white border border-gray-200 hover:border-green-500 hover:text-green-600 transition-colors"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
