"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function RolesPage() {

  const router =
    useRouter();




  // ======================
  // STATES
  // ======================

  const [
    roles,
    setRoles,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedRole,
    setSelectedRole,
  ] = useState("");




  // ======================
  // PAGINATION
  // ======================

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(5);




  // ======================
  // MODULES
  // ======================

  const modules = [

    "products",

    "categories",

    "cms",
  ];




  // ======================
  // FETCH ROLES
  // ======================

  async function fetchRoles() {

    try {

      const response =
        await fetch(
          "/api/roles"
        );

      const data =
        await response.json();

      setRoles(
        data.roles || []
      );




      if (
        data.roles?.length > 0
      ) {

        setSelectedRole(
          String(
            data.roles[0].id
          )
        );
      }

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
          "/api/pagination"
        );

      const result =
        await response.json();

      setLimit(
        result.data.roles || 5
      );

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // LOAD DATA
  // ======================

  useEffect(() => {

    fetchRoles();

    fetchPagination();

  }, []);




  // ======================
  // DELETE ROLE
  // ======================

  async function handleDelete(
    id
  ) {

    const confirmDelete =
      confirm(
        "Delete this role?"
      );




    if (!confirmDelete)
      return;




    try {

      const response =
        await fetch(
          `/api/roles/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();




      if (data.success) {

        fetchRoles();
      }

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // SELECTED ROLE
  // ======================

  const selectedRoleData =
    roles.find(
      (role) =>
        String(role.id) ===
        String(selectedRole)
    );




  // ======================
  // PAGINATION LOGIC
  // ======================

  const start =
    (page - 1) * limit;

  const end =
    page * limit;

  const paginatedModules =
    modules.slice(
      start,
      end
    );



  const totalPages =
    Math.ceil(
      modules.length / limit
    );




  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen">

        <h1 className="text-2xl font-semibold">

          Loading Roles...

        </h1>

      </div>
    );
  }




  // ======================
  // UI
  // ======================

  return (

    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">


      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">

            Roles

          </h1>

          <p className="text-gray-500 mt-2">

            Manage roles & permissions

          </p>

        </div>




        <button
          onClick={() =>
            router.push(
              "/admin/roles/add"
            )
          }
          className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
        >

          Add Role

        </button>

      </div>




      {/* ROLE DROPDOWN */}

      <div className="mb-6 text-black">

        <select
          value={selectedRole}
          onChange={(e) =>
            setSelectedRole(
              e.target.value
            )
          }
          className="border bg-white px-4 py-3 rounded-xl outline-none min-w-[250px]"
        >

          {
            roles.map(
              (role) => (

                <option
                  key={role.id}
                  value={role.id}
                >

                  {role.name}

                </option>
              )
            )
          }

        </select>

      </div>




      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">

        <table className="w-full min-w-[700px] border-collapse">


          {/* HEAD */}

          <thead className="bg-black text-white">

            <tr>

              <th className="text-left p-5 border">

                Module

              </th>

              <th className="text-center p-5 border">

                Permissions

              </th>

              <th className="text-center p-5 border">

                Actions

              </th>

            </tr>

          </thead>




          {/* BODY */}

          <tbody>

            {
              paginatedModules.map(
                (module) => (

                  <tr
                    key={module}
                    className="hover:bg-gray-50 transition"
                  >


                    {/* MODULE */}

                    <td className="p-5 border font-semibold capitalize text-gray-800">

                      {module}

                    </td>




                    {/* PERMISSIONS */}

                    <td className="p-5 border">

                      <div className="flex flex-wrap gap-2 justify-center">

                        {
                          selectedRoleData
                            ?.permissions?.[
                            module
                          ]?.create && (

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                              Create

                            </span>
                          )
                        }

                        {
                          selectedRoleData
                            ?.permissions?.[
                            module
                          ]?.edit && (

                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                              Edit

                            </span>
                          )
                        }

                        {
                          selectedRoleData
                            ?.permissions?.[
                            module
                          ]?.delete && (

                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                              Delete

                            </span>
                          )
                        }

                        {
                          !selectedRoleData
                            ?.permissions?.[
                            module
                          ]?.create &&

                          !selectedRoleData
                            ?.permissions?.[
                            module
                          ]?.edit &&

                          !selectedRoleData
                            ?.permissions?.[
                            module
                          ]?.delete && (

                            <span className="text-gray-400 text-sm">

                              No Permissions

                            </span>
                          )
                        }

                      </div>

                    </td>




                    {/* ACTIONS */}

                    <td className="p-5 border">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            router.push(
                              `/admin/roles/edit/${selectedRole}`
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition"
                        >

                          Edit

                        </button>




                        <button
                          onClick={() =>
                            handleDelete(
                              selectedRole
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition"
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




      {/* PAGINATION */}

      <div className="flex items-center justify-center gap-2 mt-8">


        {/* PREV */}

        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
        >

          Prev

        </button>




        {/* PAGE NUMBERS */}

        {Array.from(
          { length: totalPages },
          (_, index) => (

            <button
              key={index}
              onClick={() =>
                setPage(index + 1)
              }
              className={`px-4 py-2 rounded-lg border transition ${
                page === index + 1
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >

              {index + 1}

            </button>

          )
        )}




        {/* NEXT */}

        <button
          disabled={
            page === totalPages
          }
          onClick={() =>
            setPage(page + 1)
          }
          className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
        >

          Next

        </button>

      </div>

    </div>
  );
}