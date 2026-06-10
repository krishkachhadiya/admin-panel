"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import TableHeader from "@/components/TableHeader";
import { sortData } from "@/lib/sortdata";

export default function CategoriesPage() {

  const router =
    useRouter();




  // ======================
  // STATES
  // ======================

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    admin,
    setAdmin,
  ] = useState(null);




  // ======================
  // PAGINATION
  // ======================

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);


  const [sortField, setSortField] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");

  // ======================
  // FETCH CATEGORIES
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

    } finally {

      setLoading(false);

    }
  }


  // ======================
  // FETCH PAGINATION
  // ======================

  async function fetchPagination() {

    try {

      const response =
        await fetch(
          "/api/settings"
        );

      const result =
        await response.json();

      setLimit(
        result.data.pagination || 10
      );

    } catch (error) {

      console.log(error);

    }
  }


  // sorting logic 

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
  // LOAD DATA
  // ======================

  useEffect(() => {

    fetchCategories();

    fetchPagination();




    const storedAdmin =
      sessionStorage.getItem(
        "admin"
      );




    if (storedAdmin) {

      setAdmin(
        JSON.parse(
          storedAdmin
        )
      );
    }

  }, []);




  // ======================
  // DELETE CATEGORY
  // ======================

  async function handleDelete(
    id
  ) {

    const confirmDelete =
      confirm(
        "Are you sure you want to delete this category?"
      );




    if (!confirmDelete)
      return;




    try {

      const response =
        await fetch(
          `/api/categories/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();




      if (data.success) {

        fetchCategories();
      }

    } catch (error) {

      console.log(error);

    }
  }


  // sorting
  const sortedCategories =
    sortData(
      categories,
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

  const paginatedCategories =
    sortedCategories.slice(
      start,
      end
    );



  const totalPages =
    Math.ceil(
      sortedCategories.length /
      limit
    );




  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">

        Loading Categories...

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

            Categories

          </h1>

          <p className="text-gray-500 mt-1">

            Manage all categories

          </p>

        </div>




        {/* Add Category */}

        {(

          admin?.role ===
          "admin" ||

          admin?.permissions
            ?.categories
            ?.create

        ) && (

            <button
              onClick={() =>
                router.push(
                  "/admin/categories/add"
                )
              }
              className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
            >

              Add Category

            </button>

          )}

      </div>




      {/* Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">


          {/* Head */}

          <thead className="bg-black text-white">

            <tr>

              <TableHeader
                label="Title"
                field="title"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <TableHeader
                label="Slug"
                field="slug"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <TableHeader
                label="Parent"
                field="parent"
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

            {paginatedCategories.map(
              (category) => (

                <tr
                  key={category.id}
                  className="border-b hover:bg-gray-50 transition"
                >


                  {/* Title */}

                  <td className="p-4 font-semibold text-gray-800">

                    {category.title}

                  </td>




                  {/* Slug */}

                  <td className="p-4 text-gray-700">

                    {category.slug}

                  </td>




                  {/* Parent */}

                  <td className="p-4 text-gray-700">

                    {
                      category.parent

                        ? categories.find(
                          (item) =>
                            String(item.id) ===
                            String(category.parent)
                        )?.title || ""

                        : "Parent"
                    }

                  </td>



                  {/* Status */}

                  <td className="p-4">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${category.status ===
                        "active"

                        ? "bg-green-100 text-green-700"

                        : "bg-red-100 text-red-700"
                        }`}
                    >

                      {category.status}

                    </span>

                  </td>




                  {/* Created */}

                  <td className="p-4 text-gray-600 text-sm">

                    {new Date(
                      category.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </td>

                  <td className="p-4 text-gray-600 text-sm">

                    {category.updatedAt

                      ? new Date(
                        category.updatedAt
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
                          ?.categories
                          ?.edit

                      ) && (

                          <button
                            onClick={() =>
                              router.push(
                                `/admin/categories/edit/${category.id}`
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
                          ?.categories
                          ?.delete

                      ) && (

                          <button
                            onClick={() =>
                              handleDelete(
                                category.id
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