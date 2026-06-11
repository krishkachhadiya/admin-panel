import { NextResponse } from "next/server";
import {
  readData,
  writeData,
} from "@/lib/filehandler";

export async function POST(
  req
) {

  try {

    const data =
      await req.json();

    writeData(
      "pagination.json",
      data
    );

    return NextResponse.json({

      success: true,

    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message:
          error.message,
      },
      {
        status: 500,
      }
    );

  }

}