"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function AdminsPage() {

  // ======================
  // STATES
  // ======================

  const [admins, setAdmins] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const router =
    useRouter();




  // ======================
  // FETCH USERS
  // ======================

  async function fetchAdmins() {

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/admins"
        );

      const data =
        await response.json();




      // REMOVE ADMIN

      const filteredUsers =
        (data.admins || [])
          .filter(
            (user) =>
              user.role !==
              "admin"
          );




      setAdmins(
        filteredUsers
      );

    } catch (error) {

      console.log(error);

      setAdmins([]);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    fetchAdmins();
    

  }, []);




  // ======================
  // DELETE USER
  // ======================

  async function handleDelete(
    id
  ) {

    const confirmDelete =
      confirm(
        "Delete this user?"
      );




    if (!confirmDelete)
      return;




    try {

      const response =
        await fetch(
          `/api/admins/${id}`,
          {
            method: "DELETE",
          }
        );




      const data =
        await response.json();




      if (data.success) {

        fetchAdmins();
      }

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">

        Loading Users...

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
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage users
          </p>

        </div>




        <button
          onClick={() =>
            router.push(
              "/admin/admins/add"
            )
          }
          className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Add User
        </button>

      </div>




      {/* Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">


          {/* Head */}

          <thead className="bg-black text-white">

            <tr>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Role
              </th>

              <th className="text-left p-4">
                Actions
              </th>

            </tr>

          </thead>




          {/* Body */}

          <tbody>

            {admins.length > 0 ? (

              admins.map(
                (admin) => (

                  <tr
                    key={admin.id}
                    className="border-b hover:bg-gray-50 transition"
                  >


                    {/* Name */}

                    <td className="p-4">

                      <h2 className="font-semibold text-lg text-gray-800">

                        {admin.name}

                      </h2>

                    </td>




                    {/* Email */}

                    <td className="p-4 text-gray-600">

                      {admin.email}

                    </td>




                    {/* Role */}

                    <td className="p-4">

                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">

                        {
                          admin.role
                        }

                      </span>

                    </td>




                    {/* Actions */}

                    <td className="p-4">

                      <div className="flex gap-3">


                        {/* Edit */}

                        <button
                          onClick={() =>
                            router.push(
                              `/admin/admins/edit/${admin.id}`
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        >

                          Edit

                        </button>




                        {/* Delete */}

                        <button
                          onClick={() =>
                            handleDelete(
                              admin.id
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                        >

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500"
                >

                  No Users Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}