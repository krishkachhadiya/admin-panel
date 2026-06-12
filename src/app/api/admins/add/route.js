import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/filehandler";
import { getAdmin } from "@/lib/auth";

// ======================
// ADD USER
// ======================
export async function POST(req) {
  console.log("ADD USER API HIT");
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    if (admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can add users",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    let {
      name,
      email,
      password,
      role,
      permissions,
    } = body;

    // ======================
    // VALIDATION
    // ======================
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    if (password.trim().length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // ======================
    // CLEAN VALUES
    // ======================
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();
    role = role.trim();

    // ======================
    // READ ADMINS
    // ======================
    const admins = readData("admins.json");

    // ======================
    // CHECK EMAIL OR NAME EXISTS
    // ======================
    const alreadyExists = admins.find(
      (item) =>
        item.email?.toLowerCase() === email.toLowerCase() ||
        item.name?.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Email or username already exists",
        },
        { status: 400 }
      );
    }

    // ======================
    // CREATE USER
    // ======================
    const newAdmin = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      permissions: permissions || {},
      createdAt: new Date().toISOString(),
    };

    // ======================
    // PUSH USER
    // ======================
    admins.push(newAdmin);

    // ======================
    // SAVE FILE
    // ======================
    writeData("admins.json", admins);

    // ======================
    // RESPONSE
    // ======================
    return NextResponse.json({
      success: true,
      message: "User Added Successfully",
      admin: newAdmin,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}