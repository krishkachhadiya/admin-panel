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




    // READ USERS

    const users =
      readData(
        "admins.json"
      );




    // FIND USER

    const userIndex =
      users.findIndex(
        (user) =>
          user.id === id
      );




    if (
      userIndex === -1
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




    // UPDATE PERMISSIONS

    users[userIndex]
      .permissions = {

      ...users[userIndex]
        .permissions,

      ...body,
    };

    // SAVE FILE

    writeData(
      "users.json",
      users
    );

    return NextResponse.json({
      success: true,

      message:
        "Permissions Updated",

      user:
        users[userIndex],
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