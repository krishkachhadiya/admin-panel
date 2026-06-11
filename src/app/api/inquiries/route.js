import { NextResponse } from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";

export async function POST(
  req
) {

  try {

    const body =
      await req.json();

    const inquiries =
      readData(
        "inquiries.json"
      );

    const newInquiry = {

      id: Date.now(),

      name:
        body.name,

      email:
        body.email,

      phone:
        body.phone,

      subject:
        body.subject,

      message:
        body.message,

      status: "new",

      createdAt:
        new Date().toISOString(),

    };

    inquiries.push(
      newInquiry
    );

    writeData(
      "inquiries.json",
      inquiries
    );

    return NextResponse.json({
      success: true,
      message:
        "Inquiry submitted successfully",
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }

}


export async function GET() {

  const inquiries =
    readData(
      "inquiries.json"
    );

  return NextResponse.json(
    inquiries
  );

}