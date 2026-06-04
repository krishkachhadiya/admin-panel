import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
  

import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// GET CATEGORIES
// ======================

export async function GET() {

  try {

    const categories =
      readData(
        "categories.json"
      );




    return NextResponse.json(
      categories
    );

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
// CREATE CATEGORY
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
      "admin" &&
      !admin?.permissions
        ?.categories?.create
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Permission denied",
        },
        { status: 403 }
      );
    }
    const body =
      await req.json();




    let {

      title,

      slug,

      metaTitle,

      metaDescription,

      parent,

      status,

    } = body;




    // ======================
    // VALIDATION
    // ======================

    if (
      !title
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Title required",
        },
        { status: 400 }
      );
    }




    if (
      !slug
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Slug required",
        },
        { status: 400 }
      );
    }




    // ======================
    // CLEAN VALUES
    // ======================

    title =
      title.trim();

    slug =
      slug
        .trim()
        .toLowerCase();

    metaTitle =
      metaTitle?.trim() || "";

    metaDescription =
      metaDescription?.trim() || "";




    // ======================
    // READ FILE
    // ======================

    const categories =
      readData(
        "categories.json"
      );




    // ======================
    // CHECK DUPLICATE
    // ======================
    // ======================
    // CHECK TITLE EXISTS
    // ======================

    const titleExists =
      categories.find(
        (item) =>

          item.title
            ?.trim()
            .toLowerCase() ===

          title
            .trim()
            .toLowerCase()
      );

    if (
      titleExists
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Category title already exists",
        },
        { status: 400 }
      );
    }




    // ======================
    // CHECK SLUG EXISTS
    // ======================

    const slugExists =
      categories.find(
        (item) =>

          item.slug
            ?.trim()
            .toLowerCase() ===

          slug
            .trim()
            .toLowerCase()
      );

    if (
      slugExists
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Slug already exists",
        },
        { status: 400 }
      );
    }




    // ======================
    // CREATE DATA
    // ======================

    const newCategory = {

      id:
        Date.now(),

      title,

      slug,

      metaTitle:
        metaTitle
          ?.replace(
            /<[^>]*>/g,
            " "
          )

          ?.replace(
            /\s+/g,
            " "
          )

          ?.trim() || "",


      metaDescription:

        metaDescription

          ?.replace(
            /<[^>]*>/g,
            " "
          )

          ?.replace(
            /\s+/g,
            " "
          )

          ?.trim() || "",

      parent:
        parent || null,

      status:
        status || "active",

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };




    // ======================
    // PUSH DATA
    // ======================

    categories.push(
      newCategory
    );




    // ======================
    // SAVE FILE
    // ======================

    writeData(
      "categories.json",
      categories
    );




    // ======================
    // RESPONSE
    // ======================

    return NextResponse.json({

      success: true,

      message:
        "Category Created Successfully",

      category:
        newCategory,
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