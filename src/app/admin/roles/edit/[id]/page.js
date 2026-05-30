"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

export default function EditRolePage() {

  const router =
    useRouter();

  const params =
    useParams();

  const id =
    params.id;




  // ======================
  // STATES
  // ======================

  const [
    loading,
    setLoading,
  ] = useState(true);




  const [
    formData,
    setFormData,
  ] = useState({

    name: "",

    permissions: {

      products: {

        create: false,

        edit: false,

        delete: false,
      },

      categories: {

        create: false,

        edit: false,

        delete: false,
      },

      cms: {

        create: false,

        edit: false,

        delete: false,
      },
    },
  });




  // ======================
  // MODULES
  // ======================

  const modules = [

    "products",

    "categories",

    "cms",
  ];




  // ======================
  // FETCH ROLE
  // ======================

  async function fetchRole() {

    try {

      const response =
        await fetch(
          `/api/roles/${id}`
        );




      const data =
        await response.json();




      if (data.success) {

        setFormData({

          name:
            data.role.name,

          permissions:
            data.role
              .permissions,
        });
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }




  // ======================
  // LOAD
  // ======================

  useEffect(() => {

    if (id) {

      fetchRole();
    }

  }, [id]);




  // ======================
  // HANDLE CHECKBOX
  // ======================

  function handlePermissionChange(
    module,
    action,
    value
  ) {

    let updatedPermissions = {

      ...formData.permissions,

      [module]: {

        ...formData
          .permissions[
          module
        ],

        [action]:
          value,
      },
    };




    // CATEGORY →
    // SUBCATEGORY

    if (
      module ===
      "categories"
    ) {

      updatedPermissions = {

        ...updatedPermissions,

        subcategories: {

          ...formData
            .permissions
            ?.subcategories,

          [action]:
            value,
        },
      };
    }




    setFormData({

      ...formData,

      permissions:
        updatedPermissions,
    });
  }




  // ======================
  // HANDLE UPDATE
  // ======================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();




    try {

      const response =
        await fetch(
          `/api/roles/${id}`,
          {

            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );




      const data =
        await response.json();




      if (data.success) {

        alert(
          "Role Updated Successfully"
        );




        router.push(
          "/admin/roles"
        );
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

        Loading Role...

      </div>
    );
  }




  // ======================
  // UI
  // ======================

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">


        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-gray-800">

            Edit Role

          </h1>

          <p className="text-gray-500 mt-2">

            Update role permissions

          </p>

        </div>




        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-10"
        >


          {/* ROLE NAME */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Role Name

            </label>

            <input
              type="text"
              value={
                formData.name
              }
              onChange={(e) =>
                setFormData({

                  ...formData,

                  name:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            />

          </div>




          {/* PERMISSIONS */}

          <div className="bg-white border rounded-2xl overflow-hidden">

            <table className="w-full">


              {/* HEAD */}

              <thead className="bg-black text-white">

                <tr>

                  <th className="text-left p-5 text-lg">

                    Module

                  </th>

                  <th className="text-center p-5 text-lg">

                    Create

                  </th>

                  <th className="text-center p-5 text-lg">

                    Edit

                  </th>

                  <th className="text-center p-5 text-lg">

                    Delete

                  </th>

                </tr>

              </thead>




              {/* BODY */}

              <tbody>

                {
                  modules.map(
                    (module) => (

                      <tr
                        key={module}
                        className="border-b hover:bg-gray-50 transition"
                      >


                        {/* MODULE */}

                        <td className="p-5 font-semibold text-gray-800 capitalize">

                          {module}

                        </td>




                        {/* CREATE */}

                        <td className="text-center p-5">

                          <input
                            type="checkbox"
                            checked={
                              formData
                                .permissions[
                                module
                              ]?.create ||
                              false
                            }
                            onChange={(e) =>
                              handlePermissionChange(
                                module,
                                "create",
                                e.target
                                  .checked
                              )
                            }
                            className="w-5 h-5 accent-black"
                          />

                        </td>




                        {/* EDIT */}

                        <td className="text-center p-5">

                          <input
                            type="checkbox"
                            checked={
                              formData
                                .permissions[
                                module
                              ]?.edit ||
                              false
                            }
                            onChange={(e) =>
                              handlePermissionChange(
                                module,
                                "edit",
                                e.target
                                  .checked
                              )
                            }
                            className="w-5 h-5 accent-black"
                          />

                        </td>




                        {/* DELETE */}

                        <td className="text-center p-5">

                          <input
                            type="checkbox"
                            checked={
                              formData
                                .permissions[
                                module
                              ]?.delete ||
                              false
                            }
                            onChange={(e) =>
                              handlePermissionChange(
                                module,
                                "delete",
                                e.target
                                  .checked
                              )
                            }
                            className="w-5 h-5 accent-black"
                          />

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>

          </div>




          {/* SUBMIT */}

          <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">

            Update Role

          </button>

        </form>

      </div>

    </div>
  );
}