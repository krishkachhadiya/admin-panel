import { NextResponse } from "next/server";

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

    const params =
      await context.params;

    const id =
      params.id;

    const body =
      await req.json();




    // READ PRODUCTS

    const products =
      readData(
        "products.json"
      );




    // FIND PRODUCT

    const productIndex =
      products.findIndex(
        (item) =>
          String(item.id) ===
          String(id)
      );




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