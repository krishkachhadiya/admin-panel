import { NextResponse }
from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// ADD USER
// ======================

export async function POST(
  req
) {

  try {

    const body =
      await req.json();




    // READ ADMINS

    const admins =
      readData(
        "admins.json"
      );




    // CREATE USER

    const newAdmin = {

      id: Date.now(),

      name: body.name,

      email: body.email,

      password:
        body.password,

      role: body.role,

      permissions:
        body.permissions,
    };




    // PUSH USER

    admins.push(
      newAdmin
    );




    // SAVE FILE

    writeData(
      "admins.json",
      admins
    );




    return NextResponse.json({
      success: true,

      admin:
        newAdmin,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Server Error",
      },
      { status: 500 }
    );
  }
}