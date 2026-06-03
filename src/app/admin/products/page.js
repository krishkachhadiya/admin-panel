"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { getCategoryPath } from "@/lib/category-tree";

import TableHeader from "@/components/TableHeader";

import { sortData } from "@/lib/sortdata";

export default function ProductsPage() {

  const router = useRouter();

  // ======================
  // STATES
  // ======================

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [admin, setAdmin] = useState(null);

  // ======================
  // PAGINATION
  // ======================
  const [sortField, setSortField] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);


  // ======================
  // FETCH PRODUCTS
  // ======================

  async function fetchProducts() {

    try {

      const response = await fetch("/api/products");

      const data = await response.json();

      setProducts(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  // ======================
  // FETCH CATEGORIES
  // ======================

  async function fetchCategories() {

    try {

      const response = await fetch("/api/categories");

      const data = await response.json();

      setCategories(data);

    } catch (error) {

      console.log(error);
    }
  }

  // ======================
  // FETCH PAGINATION
  // ======================

  async function fetchPagination() {

    try {

      const response = await fetch("/api/pagination");

      const result = await response.json();

      setLimit(result.data.products || 10);

    } catch (error) {

      console.log(error);

    }
  }

  // ======================
  // LOAD DATA
  // ======================

  useEffect(() => {

    fetchProducts();

    fetchCategories();

    fetchPagination();


    const storedAdmin = sessionStorage.getItem("admin");


    if (storedAdmin) {
      setAdmin(
        JSON.parse(
          storedAdmin
        )
      );
    }

  }, []);


  // ======================
  // DELETE PRODUCT
  // ======================

  async function handleDelete(id) {

    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete)
      return;

    try {

      const response = await fetch(`/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {

        fetchProducts();
      }

    } catch (error) {

      console.log(error);

    }
  }

  //sorting function

  const handleSort = (field) => {
    setPage(1);

    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };


  // ======================
  // TOGGLE STATUS
  // ======================

  async function toggleStatus(product) {

    try {

      const response =
        await fetch(`/api/products/${product.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              status:
                product.status === "active" ? "inactive" : "active",
            }),
          }
        );

      const data = await response.json();

      if (data.success) {

        fetchProducts();
      }

    } catch (error) {

      console.log(error);

    }
  }



  // ======================
  // FILTER PRODUCTS
  // ======================

  const filteredProducts =
    products.filter(
      (product) => {

        // Search

        const searchMatch =

          !search ||

          product.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        // Status

        const statusMatch =

          !statusFilter ||

          product.status ===
          statusFilter;

        // Category

        let categoryMatch = true;

        if (
          selectedCategory
        ) {

          categoryMatch =
            false;

          let current =
            categories.find(
              (item) =>
                String(item.id) ===
                String(
                  product.category
                )
            );

          while (
            current
          ) {

            if (
              String(
                current.id
              ) ===
              String(
                selectedCategory
              )
            ) {

              categoryMatch =
                true;

              break;

            }

            current =
              categories.find(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(
                    current.parent
                  )
              );

          }

        }

        return (

          searchMatch &&

          statusMatch &&

          categoryMatch

        );

      }
    );

  const sortedProducts =
    sortData(
      filteredProducts,
      sortField,
      sortOrder
    );

  // ======================
  // PAGINATION LOGIC
  // ======================

  const start =
    (page - 1) * limit;

  const end =
    page * limit;

  const paginatedProducts =
    sortedProducts.slice(
      start,
      end
    );



  const totalPages =
    Math.ceil(
      sortedProducts.length /
      limit
    );




  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">

        Loading Products...

      </div>
    );
  }




  // ======================
  // UI
  // ======================

  return (
    <div className="min-h-screen bg-gray-100 p-8">


      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">

            Products

          </h1>

          <p className="text-gray-500 mt-1">

            Manage all products

          </p>

        </div>




        {/* Add Product */}

        {(

          admin?.role ===
          "admin" ||

          admin?.permissions
            ?.products
            ?.create

        ) && (

            <button
              onClick={() =>
                router.push(
                  "/admin/products/add"
                )
              }
              className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
            >

              Add Product

            </button>

          )}

      </div>




      {/* Filters */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <label className="block text-lg font-semibold text-gray-700 mb-4">

            Search Product

          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => {

              setSearch(
                e.target.value
              );

              setPage(1);

            }}
            placeholder="Search product..."
            className="w-full border border-gray-300 p-4 rounded-xl text-black"
          />

        </div>

        {/* Category Filter */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <label className="block text-lg font-semibold text-gray-700 mb-4">

            Filter By Category

          </label>

          <select
            value={
              selectedCategory
            }
            onChange={(e) => {

              setSelectedCategory(
                e.target.value
              );



              setPage(1);
            }}
            className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
          >

            <option value="">
              All Categories
            </option>

            {
              categories
                .filter(
                  (item) =>
                    item.parent === null
                )
                .map(
                  (category) => (

                    <option
                      key={category.id}
                      value={
                        category.id
                      }
                    >

                      {getCategoryPath(
                        categories,
                        category.id
                      )}

                    </option>

                  )
                )}

          </select>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <label className="block text-lg font-semibold text-gray-700 mb-4">

            Status

          </label>

          <select
            value={
              statusFilter
            }
            onChange={(e) => {

              setStatusFilter(
                e.target.value
              );

              setPage(1);

            }}
            className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl"
          >

            <option value="">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

        </div>



        {/* Subcategory Filter */}


      </div>




      {/* Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-black text-white">

            <tr>

              <TableHeader
                label="Product"
                field="title"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <TableHeader
                label="Category"
                field="category"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <TableHeader
                label="Status"
                field="status"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <th className="text-left p-4">
                Images
              </th>

              <TableHeader
                label="Created"
                field="createdAt"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <TableHeader
                label="Updated"
                field="updatedAt"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <th className="text-left p-4">
                Actions
              </th>

            </tr>

          </thead>

          {/* Body */}

          <tbody>

            {paginatedProducts.map(
              (product) => (

                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >


                  {/* Product */}

                  <td className="p-4">

                    <div className="flex items-center gap-4">


                      {/* Image */}

                      <img
                        src={
                          product.images?.[0]
                        }
                        alt={
                          product.title
                        }
                        className="w-16 h-16 object-cover rounded-xl border"
                      />




                      {/* Info */}

                      <div>

                        <h2 className="font-semibold text-lg text-gray-800">

                          {product.title}

                        </h2>

                      </div>

                    </div>

                  </td>




                  {/* Category */}

                  <td className="p-4 text-gray-700 font-medium">

                    {getCategoryPath(
                      categories,
                      product.category
                    )}

                  </td>


                  {/* Status */}

                  <td className="p-4">

                    {(

                      admin?.role ===
                      "admin" ||

                      admin?.permissions
                        ?.products
                        ?.edit

                    ) ? (

                      <button
                        onClick={() =>
                          toggleStatus(
                            product
                          )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium ${product.status ===
                          "active"

                          ? "bg-green-100 text-green-700"

                          : "bg-red-100 text-red-700"
                          }`}
                      >

                        {
                          product.status
                        }

                      </button>

                    ) : (

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${product.status ===
                          "active"

                          ? "bg-green-100 text-green-700"

                          : "bg-red-100 text-red-700"
                          }`}
                      >

                        {
                          product.status
                        }

                      </span>

                    )}

                  </td>




                  {/* Images */}

                  <td className="p-4 text-black">

                    {
                      product.images?.length
                    } Images

                  </td>




                  {/* Created */}

                  <td className="p-4 text-gray-600 text-sm">

                    {new Date(
                      product.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </td>

                  <td className="p-4 text-gray-600 text-sm">

                    {product.updatedAt

                      ? new Date(
                        product.updatedAt
                      ).toLocaleString(
                        "en-IN"
                      )

                      : "-"
                    }

                  </td>


                  {/* Actions */}

                  <td className="p-4">

                    <div className="flex gap-3">


                      {/* Edit */}

                      {(

                        admin?.role ===
                        "admin" ||

                        admin?.permissions
                          ?.products
                          ?.edit

                      ) && (

                          <button
                            onClick={() =>
                              router.push(
                                `/admin/products/edit/${product.id}`
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                          >

                            Edit

                          </button>

                        )}




                      {/* Delete */}

                      {(

                        admin?.role ===
                        "admin" ||

                        admin?.permissions
                          ?.products
                          ?.delete

                      ) && (

                          <button
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                          >

                            Delete

                          </button>

                        )}

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex items-center justify-center gap-2 mt-8 text-black">


        {/* Prev */}

        {page > 1 && (
          <button
            onClick={() =>
              setPage(page - 1)
            }
            className="px-4 py-2 rounded-lg border bg-white"
          >
            Prev
          </button>
        )}



        {/* Numbers */}

        {Array.from(
          { length: totalPages },
          (_, index) => (

            <button
              key={index}
              onClick={() =>
                setPage(index + 1)
              }
              className={`px-4 py-2 rounded-lg border transition ${page === index + 1
                ? "bg-black text-white"
                : "bg-white text-black"
                }`}
            >

              {index + 1}

            </button>

          )
        )}


        {/* Next */}

        {page < totalPages && (
          <button
            onClick={() =>
              setPage(page + 1)
            }
            className="px-4 py-2 rounded-lg border bg-white"
          >
            Next
          </button>
        )}

      </div>

    </div>
  );
}