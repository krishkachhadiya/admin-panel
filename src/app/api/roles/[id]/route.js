import { NextResponse }
from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// GET SINGLE ROLE
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




    const roles =
      readData(
        "roles.json"
      );




    const role =
      roles.find(
        (item) =>
          item.id === id
      );




    return NextResponse.json({

      success: true,

      role,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}




// ======================
// UPDATE ROLE
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




    const roles =
      readData(
        "roles.json"
      );




    const roleIndex =
      roles.findIndex(
        (item) =>
          item.id === id
      );




    roles[
      roleIndex
    ] = {

      ...roles[
        roleIndex
      ],

      name:
        body.name,

      permissions:
        body.permissions,
    };




    writeData(
      "roles.json",
      roles
    );




    return NextResponse.json({

      success: true,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}




// ======================
// DELETE ROLE
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




    const roles =
      readData(
        "roles.json"
      );




    const filteredRoles =
      roles.filter(
        (item) =>
          item.id !== id
      );




    writeData(
      "roles.json",
      filteredRoles
    );




    return NextResponse.json({

      success: true,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}