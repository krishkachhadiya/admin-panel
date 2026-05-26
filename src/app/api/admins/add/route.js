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

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "All fields are required",
        },
        { status: 400 }
      );
    }

    // ======================
    // CLEAN VALUES
    // ======================

    name =
      name.trim();

    email =
      email
        .trim()
        .toLowerCase();

    password =
      password.trim();

    role =
      role.trim();

    // ======================
    // READ ADMINS
    // ======================

    const admins =
      readData(
        "admins.json"
      );

    // ======================
// CHECK EMAIL OR NAME EXISTS
// ======================

const alreadyExists =
  admins.find(
    (item) =>

      item.email
        ?.toLowerCase() ===
        email.toLowerCase() ||

      item.name
        ?.toLowerCase() ===
        name.toLowerCase()
  );

if (
  alreadyExists
) {

  return NextResponse.json(
    {
      success: false,

      message:
        "Email or username already exists",
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

      permissions:
        permissions || {},
    };


    // ======================
    // PUSH USER
    // ======================

    admins.push(
      newAdmin
    );

    // ======================
    // SAVE FILE
    // ======================

    writeData(
      "admins.json",
      admins
    );

    // ======================
    // RESPONSE
    // ======================

    return NextResponse.json({

      success: true,

      message:
        "User Added Successfully",

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