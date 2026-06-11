import { NextResponse } from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";

import { getAdmin } from "@/lib/auth";


// ======================
// GET ROLES
// ======================

export async function GET() {

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

    const roles =
      readData(
        "roles.json"
      );

    return NextResponse.json({

      success: true,

      roles,

    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,

        roles: [],
      },
      { status: 500 }
    );
  }
}




// ======================
// ADD ROLE
// ======================

export async function POST(
  req
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
            "Only admin can create roles",
        },
        { status: 403 }
      );
    }

    const body =
      await req.json();




    let {

      name,

      permissions,

    } = body;




    // ======================
    // VALIDATION
    // ======================

    if (
      !name
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




    // ======================
    // CLEAN VALUE
    // ======================

    name =
      name.trim();




    // ======================
    // READ ROLES
    // ======================

    const roles =
      readData(
        "roles.json"
      );




    // ======================
    // CHECK EXISTS
    // ======================

    const alreadyExists =
      roles.find(
        (item) =>

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
            "Role already exists",
        },
        { status: 400 }
      );
    }




    // ======================
    // AUTO SUBCATEGORY
    // ======================

    permissions.subcategories = {

      create:
        permissions
          ?.categories
          ?.create || false,

      edit:
        permissions
          ?.categories
          ?.edit || false,

      delete:
        permissions
          ?.categories
          ?.delete || false,
    };




    // ======================
    // CREATE ROLE
    // ======================

    const newRole = {

      id:
        Date.now(),

      name,

      permissions:
        permissions || {},
    };




    // ======================
    // PUSH ROLE
    // ======================

    roles.push(
      newRole
    );




    // ======================
    // SAVE FILE
    // ======================

    writeData(
      "roles.json",
      roles
    );




    // ======================
    // RESPONSE
    // ======================

    return NextResponse.json({

      success: true,

      message:
        "Role Added Successfully",

      role:
        newRole,
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