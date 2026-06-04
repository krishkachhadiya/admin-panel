import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import {
  readData,
  writeData,
} from "@/lib/filehandler";



// ======================
// DELETE PRODUCT
// ======================

export async function DELETE(
  req,
  { params }
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
        ?.products?.delete
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

    const { id } = await params;

    const products =
      readData("products.json");

    const filteredProducts =
      products.filter(
        (item) =>
          item.id != id
      );

    writeData(
      "products.json",
      filteredProducts
    );

    return NextResponse.json({
      success: true,
      message:
        "Product Deleted Successfully",
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
// UPDATE PRODUCT
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
      "admin" &&
      !admin?.permissions
        ?.products?.edit
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

    const params =
      await context.params;

    const id =
      params.id;

    const body =
      await req.json();

    // ======================
    // TITLE VALIDATION
    // ======================

    if (
      !body.title?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Title is required",
        },
        { status: 400 }
      );
    }
    // ======================
    // SLUG VALIDATION
    // ======================

    if (
      !body.slug?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Slug is required",
        },
        { status: 400 }
      );
    }



    // READ PRODUCTS

    const products =
      readData(
        "products.json"
      );

    // ======================
    // DUPLICATE TITLE
    // ======================

    const titleExists =
      products.find(
        (item) =>
          String(item.id) !==
          String(id) &&
          item.title
            ?.toLowerCase() ===
          body.title
            ?.trim()
            .toLowerCase()
      );

    if (titleExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product title already exists",
        },
        { status: 400 }
      );
    }




    // FIND PRODUCT

    const productIndex =
      products.findIndex(
        (item) =>
          String(item.id) ===
          String(id)
      );

    const slugExists =
      products.find(
        (item) =>
          String(item.id) !==
          String(id) &&
          item.slug
            ?.trim()
            .toLowerCase() ===
          body.slug
            ?.trim()
            .toLowerCase()
      );

    if (slugExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Slug already exists",
        },
        { status: 400 }
      );
    }


    // NOT FOUND

    if (
      productIndex === -1
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Product Not Found",
        },
        { status: 404 }
      );
    }




    // UPDATE PRODUCT

    products[
      productIndex
    ] = {

      ...products[
      productIndex
      ],

      ...body,

      metaTitle:

        body.metaTitle

          ?.replace(
            /<[^>]*>/g,
            " "
          )

          ?.replace(
            /\s+/g,
            " "
          )

          ?.trim() ||

        "",

      metaDescription:

        body.metaDescription

          ?.replace(
            /<[^>]*>/g,
            " "
          )

          ?.replace(
            /\s+/g,
            " "
          )

          ?.trim() ||

        "",

      updatedAt:
        new Date().toISOString(),

    };




    // SAVE

    writeData(
      "products.json",
      products
    );




    // RESPONSE

    return NextResponse.json({
      success: true,

      message:
        "Product Updated Successfully",

      product:
        products[
        productIndex
        ],
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