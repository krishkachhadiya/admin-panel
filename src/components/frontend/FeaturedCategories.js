import Link from "next/link";

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export default async function FeaturedCategories() {
  const categories = await getCategories();

  const activeCategories = categories
    .filter((item) => item.status === "active" && item.parent === null)
    .slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            CATEGORIES
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1D3549]">
            Browse Categories
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
          {activeCategories.map((category) => (
            <Link
              key={category.id}
              href={`/frontend/products?category=${category.slug}`}
              className="group bg-white border border-gray-200 rounded-2xl p-4 md:p-6 hover:border-[#1CA16B] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1CA16B]/10 flex items-center justify-center mb-4 text-xl">
                📦
              </div>
              <h3 className="text-sm md:text-lg font-semibold text-[#1D3549] group-hover:text-[#1CA16B] transition">
                {category.title}
              </h3>
              <p className="mt-2 text-xs md:text-sm text-gray-600">
                Explore products
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}