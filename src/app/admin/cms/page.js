"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TableHeader from "@/components/TableHeader";
import { sortData } from "@/lib/sortdata";

export default function CMSPage() {
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  // ======================
  // PAGINATION
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // ======================
  // FETCH CMS
  // ======================
  async function fetchPages() {
    try {
      const response = await fetch("/api/cms");
      const data = await response.json();
      setPages(data);
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
      const response = await fetch("/api/settings");
      const result = await response.json();
      setLimit(result.data.pagination || 10);
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetchPages();
    fetchPagination();

    const storedAdmin = sessionStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // ======================
  // DELETE PAGE
  // ======================
  async function handleDelete(id) {
    const confirmDelete = confirm("Delete this page?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/cms/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        fetchPages();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //soting  
  const handleSort = (field) => {
    setPage(1);
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ======================
  // TOGGLE STATUS
  // ======================
  async function toggleStatus(pageData) {
    try {
      const response = await fetch(`/api/cms/${pageData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pageData,
          status: pageData.status === "active" ? "inactive" : "active",
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchPages();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //sorting 
  const sortedPages = sortData(pages, sortField, sortOrder);

  // ======================
  // PAGINATION LOGIC
  // ======================
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedPages = sortedPages.slice(start, end);
  const totalPages = Math.ceil(sortedPages.length / limit);

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold text-black">CMS Pages</h1>
          <p className="text-gray-500 mt-2">Manage website pages</p>
        </div>

        {/* Add Page */}
        {(admin?.role === "admin" || admin?.permissions?.cms?.create) && (
          <button
            onClick={() => router.push("/admin/cms/add")}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            Add Page
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden overflow-x-auto">
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
              <th className="text-center p-5">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedPages.length > 0 ? (
              paginatedPages.map((pageData) => (
                <tr
                  key={pageData.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Title */}
                  <td className="p-5">
                    <h2 className="font-bold text-lg text-black">
                      {pageData.title}
                    </h2>
                  </td>

                  {/* Slug */}
                  <td className="p-5 text-gray-600">/{pageData.slug}</td>

                  {/* Status */}
                  <td className="p-5 text-center">
                    {(admin?.role === "admin" || admin?.permissions?.cms?.edit) ? (
                      <button
                        onClick={() => toggleStatus(pageData)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold ${
                          pageData.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pageData.status}
                      </button>
                    ) : (
                      <span
                        className={`px-5 py-2 rounded-full text-sm font-semibold ${
                          pageData.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pageData.status}
                      </span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(pageData.createdAt).toLocaleString("en-IN")}
                  </td>

                  {/* Updated */}
                  <td className="p-4 text-gray-600 text-sm">
                    {pageData.updatedAt
                      ? new Date(pageData.updatedAt).toLocaleString("en-IN")
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="p-5">
                    <div className="flex justify-center gap-3">
                      {/* Edit */}
                      {(admin?.role === "admin" || admin?.permissions?.cms?.edit) && (
                        <button
                          onClick={() => router.push(`/admin/cms/edit/${pageData.id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl"
                        >
                          Edit
                        </button>
                      )}

                      {/* Delete */}
                      {(admin?.role === "admin" || admin?.permissions?.cms?.delete) && (
                        <button
                          onClick={() => handleDelete(pageData.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500">
                  No CMS Pages Found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8 text-black">
        {/* Prev */}
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg border bg-white"
          >
            Prev
          </button>
        )}

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-2 rounded-lg border transition ${
              page === index + 1 ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next */}
        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg border bg-white"
          >
            Next
          </button>
        )}
      </div>

    </div>
  );
}