"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function AddAdminPage() {

  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [
    existingUsers,
    setExistingUsers,
  ] = useState([]);

  const [
    emailExists,
    setEmailExists,
  ] = useState(false);


  const [
    roles,
    setRoles,
  ] = useState([]);

  const [
    formData,
    setFormData,
  ] = useState({

    name: "",

    email: "",

    password: "",

    role: "",
  });


  async function fetchUsers() {

    try {

      const response =
        await fetch(
          "/api/admins"
        );

      const data =
        await response.json();

      setExistingUsers(
        data.admins || []
      );

    } catch (error) {

      console.log(error);

    }

  }

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

    } catch (error) {

      console.log(error);

    }
  }

  useEffect(() => {

    fetchRoles();
    fetchUsers();

  }, []);




  // ======================
  // HANDLE SUBMIT
  // ======================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();




    try {

      const response =
        await fetch(
          "/api/admins/add",
          {
            method: "POST",

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

      // ERROR

      if (!data.success) {

        alert(
          data.message
        );

        return;
      }




      // SUCCESS

      alert(
        "User Added Successfully"
      );

      router.push(
        "/admin/admins"
      );

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // UI
  // ======================

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">


        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-gray-800">

            Add User

          </h1>

          <p className="text-gray-500 mt-2">

            Create new user

          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >


          {/* Name */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Name *

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




          {/* Email */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Email *

            </label>
            {emailExists && (
              <p className="text-red-500 text-sm mt-2">
                Email already exists
              </p>
            )}
            <input
              type="email"
              value={
                formData.email
              }

              onChange={(e) => {

                const value =
                  e.target.value;

                const exists =
                  existingUsers.some(
                    (item) =>

                      item.email
                        ?.trim()
                        .toLowerCase() ===

                      value
                        .trim()
                        .toLowerCase()
                  );

                setEmailExists(
                  exists
                );

                setFormData({

                  ...formData,

                  email: value,

                });

              }}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            />

          </div>




          {/* Password */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Password *

            </label>

            <input
              type="password"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
              title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
              value={
                formData.password
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>




          {/* Role */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Role *

            </label>

            <select
              value={
                formData.role
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            >

              <option value="">
                Select Role
              </option>

              {roles.map(
                (role) => (

                  <option
                    key={role.id}
                    value={role.name}
                  >

                    {role.name}

                  </option>

                )
              )}

            </select>

          </div>




          {/* Submit */}

          <button
            disabled={emailExists}
            className=" bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
            Add User
          </button>

        </form>

      </div>

    </div>
  );
}