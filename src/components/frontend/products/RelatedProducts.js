"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RelatedProducts({ product }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        const related = data.filter(
          (item) =>
            item.subcategory?.toLowerCase() === product.subcategory?.toLowerCase() &&
            item.id !== product.id &&
            item.status === "active"
        );

        setRelatedProducts(related.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, [product]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        <div className="mb-8">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            YOU MAY ALSO LIKE
          </span>
          <h2 className="mt-4 text-4xl font-bold text-[#1D3549]">
            Related Products
          </h2>
        </div>

        {/* Suggestions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="relative h-56">
                <Image
                  src={item.images?.[0] || "/no-image.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1D3549] line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {item.metaDescription}
                </p>
                <Link
                  href={`/frontend/products/${item.slug}`}
                  className="inline-block mt-4 text-[#1CA16B] font-semibold"
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