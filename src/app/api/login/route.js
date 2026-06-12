import { NextResponse } from "next/server";
import { readData } from "@/lib/filehandler";

// ======================
// LOGIN
// ======================
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // ======================
    // READ USERS
    // ======================
    const admins = readData("admins.json");

    // ======================
    // FIND USER
    // ======================
    const admin = admins.find(
      (item) => item.email === email && item.password === password
    );

    // ======================
    // INVALID USER
    // ======================
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // ======================
    // ADMIN BYPASS
    // ======================
    if (admin.role === "admin") {
      const fullPermissions = {
        products: {
          create: true,
          edit: true,
          delete: true,
        },
        categories: {
          create: true,
          edit: true,
          delete: true,
        },
        subcategories: {
          create: true,
          edit: true,
          delete: true,
        },
      };

      const response = NextResponse.json({
        success: true,
        message: "Login Successful",
        admin: {
          ...admin,
          permissions: fullPermissions,
        },
      });

      response.cookies.set(
        "admin",
        JSON.stringify({
          ...admin,
          permissions: fullPermissions,
        }),
        {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24,
        }
      );

      return response;
    }

    // ======================
    // READ ROLES
    // ======================
    const roles = readData("roles.json");

    // ======================
    // MATCH ROLE
    // ======================
    const matchedRole = roles.find((role) => role.name === admin.role);

    // ======================
    // FINAL USER
    // ======================
    const finalAdmin = {
      ...admin,
      permissions: matchedRole?.permissions || {},
    };

    // ======================
    // RESPONSE
    // ======================
    const response = NextResponse.json({
      success: true,
      message: "Login Successful",
      admin: finalAdmin,
    });

    response.cookies.set("admin", JSON.stringify(finalAdmin), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}