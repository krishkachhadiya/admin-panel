import { NextResponse }
  from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";

import { getAdmin } from "@/lib/auth";


// ======================
// GET SINGLE ROLE
// ======================

export async function GET(
  req,
  context
) {

  try {

    const admin =
      await getAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first",
        },
        { status: 401 }
      );
    }

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

    const admin =
      await getAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first",
        },
        { status: 401 }
      );
    }

    if (
      admin.role !==
      "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only admin can access this",
        },
        { status: 403 }
      );
    }

    const params =
      await context.params;

    const id =
      Number(params.id);

    const body =
      await req.json();

    if (
      !body.name?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Role name required",
        },
        { status: 400 }
      );
    }

    const roles =
      readData(
        "roles.json"
      );

    const roleIndex =
      roles.findIndex(
        (item) =>
          item.id === id
      );

    if (
      roleIndex === -1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Role Not Found",
        },
        { status: 404 }
      );
    }

    const roleExists =
      roles.find(
        (item) =>
          item.id !== id &&
          item.name
            ?.toLowerCase() ===
          body.name
            ?.trim()
            .toLowerCase()
      );

    if (roleExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Role already exists",
        },
        { status: 400 }
      );
    }

    roles[
      roleIndex
    ] = {

      ...roles[
      roleIndex
      ],

      name:
        body.name.trim(),

      permissions:
        body.permissions,
    };

    writeData(
      "roles.json",
      roles
    );

    return NextResponse.json({
      success: true,
      message:
        "Role Updated Successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
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

    const admin =
      await getAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first",
        },
        { status: 401 }
      );
    }

    if (
      admin.role !==
      "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only admin can access this",
        },
        { status: 403 }
      );
    }

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

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Role Not Found",
        },
        { status: 404 }
      );
    }

    const filteredRoles =
      roles.filter(
        (item) =>
          item.id !== id
      );
    if (
      role.name
        ?.toLowerCase() ===
      "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin role cannot be deleted",
        },
        { status: 400 }
      );
    }

    writeData(
      "roles.json",
      filteredRoles
    );

    return NextResponse.json({

      success: true,

      message:
        "Role Deleted Successfully",

    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Internal Server Error",
      },
      { status: 500 }
    );
  }
}