import { NextResponse }
from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// GET SINGLE USER
// ======================

export async function GET(
  req,
  context
) {

  try {

    const params =
      await context.params;

    const id =
      Number(params.id);




    const admins =
      readData(
        "admins.json"
      );




    const admin =
      admins.find(
        (item) =>
          item.id === id
      );




    if (!admin) {

      return NextResponse.json(
        {
          success: false,
          message:
            "User Not Found",
        },
        { status: 404 }
      );
    }




    return NextResponse.json({
      success: true,
      admin,
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




// ======================
// UPDATE USER
// ======================

export async function PUT(
  req,
  context
) {

  try {

    const params =
      await context.params;

    const id =
      Number(params.id);

    const body =
      await req.json();




    const admins =
      readData(
        "admins.json"
      );




    const adminIndex =
      admins.findIndex(
        (item) =>
          item.id === id
      );




    if (
      adminIndex === -1
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "User Not Found",
        },
        { status: 404 }
      );
    }




    admins[
      adminIndex
    ] = {

      ...admins[
        adminIndex
      ],

      name:
        body.name,

      email:
        body.email,

      password:
        body.password,

      role:
        body.role,
    };




    writeData(
      "admins.json",
      admins
    );




    return NextResponse.json({

      success: true,

      message:
        "User Updated",

      admin:
        admins[
          adminIndex
        ],
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




// ======================
// DELETE USER
// ======================

export async function DELETE(
  req,
  context
) {

  try {

    const params =
      await context.params;

    const id =
      Number(params.id);




    const admins =
      readData(
        "admins.json"
      );




    const filteredAdmins =
      admins.filter(
        (item) =>
          item.id !== id
      );




    writeData(
      "admins.json",
      filteredAdmins
    );




    return NextResponse.json({

      success: true,

      message:
        "User Deleted",
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