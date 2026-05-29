import { NextResponse } from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// GET PRODUCTS
// ======================

export async function GET() {

  try {

    const products =
      readData(
        "products.json"
      );




    return NextResponse.json(
      products
    );

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
// ADD PRODUCT
// ======================

export async function POST(
  req
) {

  try {

    const body =
      await req.json();




    let {

      title,

      slug,

      description,

      metaTitle,

      metaDescription,

      category,

      subcategory,

      status,

      images,

      specifications,

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
            "Title is required",
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
      slug?.trim();




    // ======================
    // READ PRODUCTS
    // ======================

    const products =
      readData(
        "products.json"
      );




    // ======================
    // CHECK EXISTS
    // ======================

    const alreadyExists =
      products.find(
        (item) =>

          item.title
            ?.toLowerCase() ===

          title.toLowerCase()
      );




    if (
      alreadyExists
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Product already exists",
        },
        { status: 400 }
      );
    }




    // ======================
    // CREATE PRODUCT
    // ======================

    const newProduct = {

      id:
        Date.now(),

      title,

      slug,

      description:
        description || "",

      metaTitle:
        metaTitle || "",

      metaDescription:
        metaDescription || "",

      category:
        category || "",

      subcategory:
        subcategory || "",

      status:
        status || "active",

      images:
        images || [],

      specifications:
        specifications || [],

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };




    // ======================
    // PUSH PRODUCT
    // ======================

    products.push(
      newProduct
    );




    // ======================
    // SAVE FILE
    // ======================

    writeData(
      "products.json",
      products
    );




    // ======================
    // RESPONSE
    // ======================

    return NextResponse.json({

      success: true,

      message:
        "Product Added Successfully",

      product:
        newProduct,
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