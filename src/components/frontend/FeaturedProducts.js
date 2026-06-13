import Image from "next/image";
import Link from "next/link";

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function FeaturedProducts() {
  const products = await getProducts();

  const activeProducts = products
    .filter((item) => item.status === "active")
    .slice(0, 6);

  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            PRODUCTS
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1D3549]">
            Featured Products
          </h2>
          <p className="mt-3 text-gray-600">
            Explore our latest products.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4">
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#1CA16B] hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-40 md:h-56 overflow-hidden">
                <Image
                  src={product.images?.[0] || "/no-image.jpg"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="p-4 md:p-6">
                <h3 className="text-sm md:text-xl font-semibold text-[#1D3549] line-clamp-1">
                  {product.title}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-gray-600 line-clamp-2">
                  {product.metaDescription || "Premium quality product"}
                </p>
                <Link
                  href={`/frontend/products/${product.slug}`}
                  className="inline-block mt-4 text-[#1CA16B] font-semibold hover:text-[#19535B] transition"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}