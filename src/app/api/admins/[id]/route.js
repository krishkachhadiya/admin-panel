import { NextResponse }
  from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";

import { getAdmin }
  from "@/lib/auth";


// ======================
// GET SINGLE USER
// ======================

export async function GET(
  req,
  context
) {

  try {

    const currentAdmin =
      await getAdmin();

    if (!currentAdmin) {

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

    const currentAdmin =
      await getAdmin();

    if (!currentAdmin) {

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
      currentAdmin.role !==
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
      !body.name?.trim() ||
      !body.email?.trim() ||
      !body.role?.trim()
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

    const emailExists =
      admins.find(
        (item) =>
          item.id !== id &&
          item.email
            ?.toLowerCase() ===
          body.email
            ?.toLowerCase()
      );

    if (emailExists) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Email already exists",
        },
        { status: 400 }
      );
    }

    const nameExists =
      admins.find(
        (item) =>
          item.id !== id &&
          item.name
            ?.toLowerCase() ===
          body.name
            ?.toLowerCase()
      );

    if (nameExists) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Username already exists",
        },
        { status: 400 }
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

      updatedAt:
        new Date().toISOString(),
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

    const currentAdmin =
      await getAdmin();

    if (!currentAdmin) {

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
      currentAdmin.role !==
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

    if (
      currentAdmin.id === id
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot delete your own account",
        },
        { status: 400 }
      );
    }

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