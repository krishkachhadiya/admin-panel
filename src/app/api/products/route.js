import { NextResponse } from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";

// ======================
// GET PRODUCTS
// ======================

export async function GET() {

  const products =
    readData(
      "products.json"
    );

  return NextResponse.json(
    products
  );
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

      description,

      metaTitle,

      metaDescription,

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

      id: Date.now(),

      title,

      description:
        description || "",

      metaTitle:
        metaTitle || "",

      metaDescription:
        metaDescription || "",

      status:
        status || "active",

      images:
        images || [],

      specifications:
        specifications || [],

      createdAt:
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