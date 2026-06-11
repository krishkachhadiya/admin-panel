import { NextResponse }
from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// UPDATE PERMISSIONS
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




    // READ ADMINS

    const admins =
      readData(
        "admins.json"
      );




    // FIND USER

    const adminIndex =
      admins.findIndex(
        (admin) =>
          admin.id === id
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




    // GET MODULE NAME

    const moduleName =
      Object.keys(
        body.permissions
      )[0];




    // UPDATE DYNAMIC MODULE

    admins[
      adminIndex
    ].permissions[
      moduleName
    ] = {

      ...admins[
        adminIndex
      ].permissions?.[
        moduleName
      ],

      ...body.permissions?.[
        moduleName
      ],
    };




    // SAVE FILE

    writeData(
      "admins.json",
      admins
    );




    return NextResponse.json({

      success: true,

      message:
        "Permissions Updated",

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