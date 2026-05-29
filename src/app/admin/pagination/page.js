"use client";

import {
  useEffect,
  useState,
} from "react";

export default function PaginationPage() {




  // ======================
  // STATES
  // ======================

  const [
    pagination,
    setPagination,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState("");



  // ======================
  // ADD STATES
  // ======================

  const [
    pageName,
    setPageName,
  ] = useState("");

  const [
    pageLimit,
    setPageLimit,
  ] = useState("");




  // ======================
  // FETCH PAGINATION
  // ======================

  async function fetchPagination() {

    try {

      const response =
        await fetch(
          "/api/pagination"
        );

      const result =
        await response.json();

      setPagination(
        result.data || {}
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }




  // ======================
  // LOAD DATA
  // ======================

  useEffect(() => {

    fetchPagination();

  }, []);




  // ======================
  // HANDLE CHANGE
  // ======================

  function handleChange(
    key,
    value
  ) {

    setPagination((prev) => ({

      ...prev,

      [key]: value,
    }));
  }




  // ======================
  // UPDATE PAGINATION
  // ======================

  async function handleSave(
    key
  ) {

    try {

      setSaving(key);

      const response =
        await fetch(
          "/api/pagination",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              key,

              value:
                pagination[key],
            }),
          }
        );

      const result =
        await response.json();




      if (result.success) {

        fetchPagination();
      }

    } catch (error) {

      console.log(error);

    } finally {

      setSaving("");
    }
  }




  // ======================
  // ADD PAGINATION
  // ======================

  async function handleAdd(
    e
  ) {

    e.preventDefault();




    if (
      !pageName ||
      !pageLimit
    ) {

      return;
    }




    try {

      const response =
        await fetch(
          "/api/pagination",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              key:
                pageName
                  .trim()
                  .toLowerCase(),

              value:
                Number(
                  pageLimit
                ),
            }),
          }
        );

      const result =
        await response.json();




      if (result.success) {

        setPageName("");

        setPageLimit("");

        fetchPagination();
      }

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // DELETE PAGINATION
  // ======================

  async function handleDelete(
    key
  ) {

    const confirmDelete =
      confirm(
        "Delete pagination setting?"
      );




    if (!confirmDelete)
      return;




    try {

      const updatedData = {

        ...pagination,
      };




      delete updatedData[key];




      await fetch(
        "/api/pagination/delete",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            updatedData
          ),
        }
      );




      fetchPagination();

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen">

        <h1 className="text-2xl font-bold">

          Loading...

        </h1>

      </div>
    );
  }




  // ======================
  // UI
  // ======================

  return (

    <div className="min-h-screen bg-gray-100 p-8">


      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-black">

          Pagination Settings

        </h1>

        <p className="text-gray-500 mt-2">

          Manage pagination dynamically

        </p>

      </div>




      {/* ADD FORM */}

      <form
        onSubmit={handleAdd}
        className="bg-white rounded-3xl shadow-lg p-6 mb-8"
      >

        <h2 className="text-2xl font-bold mb-5 text-black">

          Add Pagination

        </h2>




        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-black">


          {/* PAGE NAME */}

          <div>

            <label className="block mb-2 font-medium text-gray-700">

              Page Name

            </label>

            <input
              type="text"
              value={pageName}
              onChange={(e) =>
                setPageName(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />

          </div>




          {/* LIMIT */}

          <div>

            <label className="block mb-2 font-medium text-gray-700">

              Pagination Limit

            </label>

            <input
              type="number"
              min="1"
              value={pageLimit}
              onChange={(e) =>
                setPageLimit(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />

          </div>




          {/* BUTTON */}

          <div className="flex items-end">

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition"
            >

              Add Pagination

            </button>

          </div>

        </div>

      </form>




      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden text-black">

        <table className="w-full">


          {/* HEAD */}

          <thead className="bg-black text-white">

            <tr>

              <th className="text-left p-5">

                Page Name

              </th>

              <th className="text-left p-5">

                Pagination Limit

              </th>

              <th className="text-center p-5">

                Actions

              </th>

            </tr>

          </thead>




          {/* BODY */}

          <tbody>

            {
              Object.entries(
                pagination
              ).map(
                ([key, value]) => (

                  <tr
                    key={key}
                    className="border-b hover:bg-gray-50 transition"
                  >


                    {/* PAGE NAME */}

                    <td className="p-5 font-semibold text-gray-800 capitalize">

                      {key}

                    </td>




                    {/* PAGINATION */}

                    <td className="p-5">

                      <input
                        type="number"
                        min="1"
                        value={value}
                        onChange={(e) =>
                          handleChange(
                            key,
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-xl px-4 py-3 w-40 outline-none focus:ring-2 focus:ring-black"
                      />

                    </td>

                    {/* ACTIONS */}

                    <td className="p-5">

                      <div className="flex items-center justify-center gap-3">


                        {/* SAVE */}

                        <button
                          onClick={() =>
                            handleSave(
                              key
                            )
                          }
                          disabled={
                            saving === key
                          }
                          className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition disabled:opacity-50"
                        >

                          {
                            saving === key

                              ? "Saving..."

                              : "Save"
                          }

                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(
                              key
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition"
                        >

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}