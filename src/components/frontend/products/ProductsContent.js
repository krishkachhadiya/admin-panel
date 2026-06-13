"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function belongsToMainCategory(productCategoryId, mainCategoryId, categories) {
  let current = categories.find(
    (c) => Number(c.id) === Number(productCategoryId)
  );

  while (current) {
    if (Number(current.id) === Number(mainCategoryId)) {
      return true;
    }
    current = categories.find(
      (c) => Number(c.id) === Number(current.parent)
    );
  }

  return false;
}

export default function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();

        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();

        const paginationRes = await fetch("/api/settings");
        const paginationData = await paginationRes.json();

        setProducts(productsData.filter((item) => item.status === "active"));
        setProductsPerPage(Number(paginationData.data?.pagination) || 8);
        setAllCategories(categoriesData);
        setCategories(
          categoriesData.filter(
            (item) => item.status === "active" && item.parent === null
          )
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all"
        ? true
        : belongsToMainCategory(
            product.category,
            selectedCategory,
            allCategories
          );

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Filters Panel */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm mb-10">
          <div className="flex flex-col gap-5 text-black">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#1CA16B]"
            />

            {/* Category Navigation Pills */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 py-2.5 rounded-full transition ${
                  selectedCategory === "all"
                    ? "bg-[#1CA16B] text-white"
                    : "bg-gray-100 text-[#1D3549]"
                }`}
              >
                All Products
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full transition ${
                    Number(selectedCategory) === Number(category.id)
                      ? "bg-[#1CA16B] text-white"
                      : "bg-gray-100 text-[#1D3549] hover:bg-[#1CA16B] hover:text-white"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Results Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#1D3549]">Products</h2>
          <div className="px-4 py-2 rounded-full bg-[#1CA16B]/10 text-[#1CA16B] font-medium">
            {filteredProducts.length} Products Found
          </div>
        </div>

        {/* Products Display Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.images?.[0] || "/no-image.jpg"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1D3549] line-clamp-2">
                  {product.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {product.metaDescription}
                </p>
                <Link
                  href={`/frontend/products/${product.slug}`}
                  className="inline-block mt-4 text-[#1CA16B] font-medium"
                >
                  <span className="inline-flex items-center gap-2 text-[#1CA16B] font-semibold">
                    View Details →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Fallback */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-[#1D3549]">
              No Products Found
            </h3>
            <p className="mt-3 text-gray-500">
              Try another search or category.
            </p>
          </div>
        )}

        {/* Component Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 rounded-xl border bg-white text-[#1D3549] hover:bg-[#1CA16B] hover:text-white transition"
              >
                ← Prev
              </button>
            )}

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-xl transition ${
                  currentPage === index + 1
                    ? "bg-[#1CA16B] text-white"
                    : "bg-gray-100 text-[#1D3549]"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 rounded-xl border bg-white text-[#1D3549] hover:bg-[#1CA16B] hover:text-white transition"
              >
                Next →
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
}