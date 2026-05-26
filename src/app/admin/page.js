"use client";

import {
  useEffect,
  useState,
} from "react";

export default function AdminDashboard() {

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);


  // ======================
  // FETCH DATA
  // ======================

  useEffect(() => {

    fetchProducts();

    fetchCategories();

  }, []);

  // ======================
  // PRODUCTS
  // ======================

  async function fetchProducts() {

    try {

      const response =
        await fetch(
          "/api/products"
        );

      const data =
        await response.json();

      setProducts(data);

    } catch (error) {

      console.log(error);

    }
  }

  // ======================
  // CATEGORIES
  // ======================

  async function fetchCategories() {

    try {

      const response =
        await fetch(
          "/api/categories"
        );

      const data =
        await response.json();

      setCategories(data);

    } catch (error) {

      console.log(error);

    }
  }

  // ======================
  // COUNTS
  // ======================

  const activeProducts =
    products.filter(
      (item) =>
        item.status ===
        "active"
    );

  const inactiveProducts =
    products.filter(
      (item) =>
        item.status ===
        "inactive"
    );


  // ======================
  // UI
  // ======================

  return (
    <div>

      
      {/* Header */}

      <div className="mb-10">

        <h1 className="text-5xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Welcome to Admin Panel
        </p>

      </div>




      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">




        {/* Total Products */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-gray-500 text-lg">
            Total Products
          </h2>

          <h1 className="text-5xl font-bold mt-4 text-black">
            {products.length}
          </h1>

        </div>

        {/* Active Products */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-gray-500 text-lg">
            Active Products
          </h2>

          <h1 className="text-5xl font-bold mt-4 text-green-600">
            {
              activeProducts.length
            }
          </h1>

        </div>

        {/* Inactive Products */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-gray-500 text-lg">
            Inactive Products
          </h2>

          <h1 className="text-5xl font-bold mt-4 text-red-500">
            {
              inactiveProducts.length
            }
          </h1>

        </div>




        {/* Categories */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-gray-500 text-lg">
            Total Categories
          </h2>

          <h1 className="text-5xl font-bold mt-4 text-black">
            {
              categories.length
            }
          </h1>

        </div>

      </div>

    </div>
  );
}