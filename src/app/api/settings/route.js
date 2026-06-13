import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/filehandler";

// ======================
// GET
// ======================
export async function GET() {
  try {
    const settings = readData("settings.json");

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// ======================
// POST
// ======================
export async function POST(req) {
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
          message: "Permission denied",
        },
        { status: 403 }
      );
    }

    const settings = await req.json();

    // ======================
    // SAVE SETTINGS
    // ======================
    writeData("settings.json", settings);

    // ======================
    // RESPONSE
    // ======================
    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}