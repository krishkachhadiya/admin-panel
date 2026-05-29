import { NextResponse } from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";



// ======================
// GET
// ======================

export async function GET() {

  try {

    const pagination =
      readData("pagination.json");

    return NextResponse.json({
      success: true,
      data: pagination,
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

    const body =
      await req.json();

    const {
      key,
      value,
    } = body;

    const pagination =
      readData("pagination.json");

    pagination[key] = Number(value);

    writeData(
      "pagination.json",
      pagination
    );

    return NextResponse.json({
      success: true,
      message:
        "Pagination added successfully",
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