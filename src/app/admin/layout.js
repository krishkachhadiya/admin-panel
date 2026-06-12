"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);

  const protectedRoutes = {
    "/admin/products": "products",
    "/admin/categories": "categories",
    "/admin/cms": "cms",
    "/admin/settings": "global settings",
    "/admin/admins": "users",
    "/admin/roles": "roles",
  };

  // ======================
  // CHECK LOGIN & SYNC PERMISSIONS
  // ======================
  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("admin");

    if (storedAdmin) {
      const sessionAdmin = JSON.parse(storedAdmin);

      // Super Admin execution bypass
      if (sessionAdmin.role === "admin") {
        setAdmin(sessionAdmin);
        setIsLoggedIn(true);
        return;
      }

      // Refresh staff permission scopes
      fetch("/api/roles")
        .then((res) => res.json())
        .then((data) => {
          const matchedRole = data.roles.find(
            (role) => role.name === sessionAdmin.role
          );

          const updatedAdmin = {
            ...sessionAdmin,
            permissions: matchedRole?.permissions || {},
          };

          setAdmin(updatedAdmin);
          sessionStorage.setItem("admin", JSON.stringify(updatedAdmin));
          setIsLoggedIn(true);
        });
    } else {
      window.location.href = "/login";
    }
  }, []);

  // ======================
  // LOGOUT
  // ======================
  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });
    sessionStorage.clear();
    window.location.href = "/login";
  }

  // ======================
  // DYNAMIC SIDEBAR MENUS
  // ======================
  let menus = [];

  if (admin?.role === "admin") {
    menus = [
      { name: "Dashboard", path: "/admin" },
      { name: "Products", path: "/admin/products" },
      { name: "Categories", path: "/admin/categories" },
      { name: "CMS", path: "/admin/cms" },
      { name: "Global Settings", path: "/admin/settings" },
      { name: "Roles", path: "/admin/roles" },
      { name: "Users", path: "/admin/admins" },
    ];
  } else {
    // Restricted Staff Menus
    menus = [{ name: "Dashboard", path: "/admin" }];

    // Products Check
    if (
      admin?.permissions?.products?.create ||
      admin?.permissions?.products?.edit ||
      admin?.permissions?.products?.delete
    ) {
      menus.push({ name: "Products", path: "/admin/products" });
    }

    // Categories Check
    if (
      admin?.permissions?.categories?.create ||
      admin?.permissions?.categories?.edit ||
      admin?.permissions?.categories?.delete
    ) {
      menus.push({ name: "Categories", path: "/admin/categories" });
    }

    // CMS Check
    if (
      admin?.permissions?.cms?.create ||
      admin?.permissions?.cms?.edit ||
      admin?.permissions?.cms?.delete
    ) {
      menus.push({ name: "CMS", path: "/admin/cms" });
    }
  }

  function accessDenied() {
    window.location.href = "/admin";
    return null;
  }

  // ======================
  // LOADING RENDER
  // ======================
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // ======================
  // STAFF ROUTE GUARDS
  // ======================
  if (admin && admin.role !== "admin") {
    let currentModule = null;

    if (pathname.startsWith("/admin/products")) {
      currentModule = "products";
    } else if (pathname.startsWith("/admin/categories")) {
      currentModule = "categories";
    } else if (pathname.startsWith("/admin/cms")) {
      currentModule = "cms";
    } else if (pathname.startsWith("/admin/admins")) {
      currentModule = "users";
    } else if (pathname.startsWith("/admin/roles")) {
      currentModule = "roles";
    } else if (pathname.startsWith("/admin/settings")) {
      currentModule = "settings";
    }

    if (currentModule) {
      const permissions = admin?.permissions?.[currentModule];

      // Mutate action validation
      if (pathname.endsWith("/add") && !permissions?.create) {
        return accessDenied();
      }

      // Update action validation
      if (pathname.includes("/edit/") && !permissions?.edit) {
        return accessDenied();
      }

      // Broad read validation fallback
      const hasAccess =
        permissions?.create || permissions?.edit || permissions?.delete;
      if (!hasAccess) {
        return accessDenied();
      }
    }
  }

  // ======================
  // LAYOUT VIEWPORT
  // ======================
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <aside className="w-72 bg-black text-white p-6 flex flex-col justify-between">
        <div>
          {/* Brand Logo Identity */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 mt-2">
              {admin?.role?.charAt(0).toUpperCase() + admin?.role?.slice(1)}{" "}
              Access
            </p>
          </div>

          {/* Nav Links Stack */}
          <nav className="space-y-1">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                href={menu.path}
                className={`block px-5 py-4 rounded-xl transition ${
                  pathname === menu.path
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-gray-800"
                }`}
              >
                {menu.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Global Exit Target */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* Primary Dashboard Content Area */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}