import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// GET PRODUCTS
// ======================

export async function GET() {

  try {
    const admin =
      await getAdmin();

   

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
        ?.products?.create
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

       if (
      !slug
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "slug is required",
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
    const slugExists =
      products.find(
        (item) =>
          item.slug?.toLowerCase() ===
          slug?.toLowerCase()
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