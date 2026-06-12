import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/filehandler";

// ======================
// GET ADMINS
// ======================
export async function GET() {
  try {
    const admins = readData("admins.json");

    return NextResponse.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ======================
// CREATE ADMIN
// ======================
export async function POST(req) {
  try {
    const body = await req.json();
    const admins = readData("admins.json");

    const newAdmin = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      password: body.password,
      status: body.status || "active",
    };

    admins.push(newAdmin);
    writeData("admins.json", admins);

    return NextResponse.json({
      success: true,
      admin: newAdmin,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}