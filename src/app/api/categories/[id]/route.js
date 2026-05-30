import { NextResponse } from "next/server";

import {
  readData,
  writeData,
} from "@/lib/filehandler";




// ======================
// UPDATE CATEGORY
// ======================

export async function PUT(
  req,
  context
) {

  try {


    // ======================
    // GET ID
    // ======================

    const params =
      await context.params;

    const id =
      params.id;




    // ======================
    // GET BODY
    // ======================

    let body = {};

    try {

      body =
        await req.json();

    } catch {

      body = {};

    }




    // ======================
    // READ FILE
    // ======================

    const categories =
      readData(
        "categories.json"
      );




    // ======================
    // FIND CATEGORY
    // ======================

    const categoryIndex =
      categories.findIndex(
        (item) =>
          Number(item.id) ===
          Number(id)
      );




    // ======================
    // NOT FOUND
    // ======================

    if (
      categoryIndex === -1
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Category Not Found",
        },
        {
          status: 404,
        }
      );
    }




    // ======================
    // UPDATE DATA
    // ======================
    categories[
      categoryIndex
    ] = {

      ...categories[
      categoryIndex
      ],

      title:
        body.title,

      slug:
        body.slug,

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

      parent:
        body.parent,

      status:
        body.status,

      updatedAt:
        new Date().toISOString(),
    };

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
        "Category Updated Successfully",

      category:
        categories[
        categoryIndex
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
      {
        status: 500,
      }
    );
  }
}




// ======================
// DELETE CATEGORY
// ======================

export async function DELETE(
  req,
  context
) {

  try {


    // ======================
    // GET ID
    // ======================

    const params =
      await context.params;

    const id =
      params.id;




    // ======================
    // READ FILE
    // ======================

    const categories =
      readData(
        "categories.json"
      );




    // ======================
    // FILTER DATA
    // ======================

    const filteredCategories =
      categories.filter(
        (item) =>
          Number(item.id) !==
          Number(id)
      );




    // ======================
    // SAVE FILE
    // ======================

    writeData(
      "categories.json",
      filteredCategories
    );




    // ======================
    // RESPONSE
    // ======================

    return NextResponse.json({
      success: true,

      message:
        "Category Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}