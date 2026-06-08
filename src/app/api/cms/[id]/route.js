import {
  NextResponse,
} from "next/server";

import { getAdmin } from "@/lib/auth";


import {
  readData,
  writeData,
} from "@/lib/filehandler";

import {
  createSlug,
} from "@/lib/slug";




// ======================
// GET SINGLE CMS
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

    if (
      admin.role !==
      "admin" &&
      !admin?.permissions
        ?.cms?.edit
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




    const cms =
      readData(
        "cms.json"
      );




    const page =
      cms.find(
        (item) =>
          String(item.id) ===
          String(params.id)
      );




    if (!page) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Page Not Found",
        },
        { status: 404 }
      );
    }




    return NextResponse.json(
      page
    );

  } catch (error) {

    console.log(error);




    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}




// ======================
// UPDATE CMS
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
        ?.cms?.edit
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

    const body =
      await req.json();

    
    let {

      title,

      slug,

    } = body;




    // ======================
    // VALIDATION
    // ======================

    if (!title) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Page title required",
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
      slug?.trim()
        .toLowerCase() || "";




    // ======================
    // READ CMS
    // ======================

    const cms =
      readData(
        "cms.json"
      );

    const page =
      cms.find(
        (item) =>
          String(item.id) ===
          String(params.id)
      );

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Page Not Found",
        },
        { status: 404 }
      );
    }


    // ======================
    // UNIQUE SLUG
    // ======================

    const uniqueSlug =
      createSlug({

        text:
          slug || title,

        items:
          cms,

        currentId:
          Number(
            params.id
          ),

      });




    // ======================
    // UPDATE CMS
    // ======================

    const updatedCMS =
      cms.map(
        (item) => {

          if (
            String(item.id) ===
            String(params.id)
          ) {

            return {

              ...item,

              ...body,

              title,

              slug:
                uniqueSlug,

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

                  ?.trim() || "",

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

                  ?.trim() || "",

              updatedAt:
                new Date().toISOString(),

            };
          }

          return item;
        }
      );




    // ======================
    // SAVE FILE
    // ======================

    writeData(
      "cms.json",
      updatedCMS
    );




    // ======================
    // RESPONSE
    // ======================

    return NextResponse.json({

      success: true,

      message:
        "CMS Updated Successfully",

    });

  } catch (error) {

    console.log(error);




    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}




// ======================
// DELETE CMS
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
      "admin" &&
      !admin?.permissions
        ?.cms?.delete
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




    const cms =
      readData(
        "cms.json"
      );

    const page =
      cms.find(
        (item) =>
          String(item.id) ===
          String(params.id)
      );

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Page Not Found",
        },
        { status: 404 }
      );
    }


    const filteredCMS =
      cms.filter(
        (item) =>
          String(item.id) !==
          String(params.id)
      );




    writeData(
      "cms.json",
      filteredCMS
    );




    return NextResponse.json({

      success: true,

      message:
        "CMS Deleted Successfully",

    });

  } catch (error) {

    console.log(error);




    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}