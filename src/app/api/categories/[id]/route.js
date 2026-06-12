import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/filehandler";

// ======================
// UPDATE CATEGORY
// ======================
export async function PUT(req, context) {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    if (
      admin.role !== "admin" &&
      !admin?.permissions?.categories?.edit
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Permission denied",
        },
        { status: 403 }
      );
    }

    // ======================
    // GET ID
    // ======================
    const params = await context.params;
    const id = params.id;

    // ======================
    // GET BODY
    // ======================
    let body = {};

    try {
      body = await req.json();
      if (!body.title?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Title required",
          },
          { status: 400 }
        );
      }

      if (!body.slug?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug required",
          },
          { status: 400 }
        );
      }
    } catch {
      body = {};
    }

    // ======================
    // READ FILE
    // ======================
    const categories = readData("categories.json");

    const titleExists = categories.find(
      (item) =>
        Number(item.id) !== Number(id) &&
        item.title?.trim().toLowerCase() === body.title?.trim().toLowerCase()
    );

    if (titleExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Category title already exists",
        },
        { status: 400 }
      );
    }

    const slugExists = categories.find(
      (item) =>
        Number(item.id) !== Number(id) &&
        item.slug?.trim().toLowerCase() === body.slug?.trim().toLowerCase()
    );

    if (slugExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        { status: 400 }
      );
    }

    // ======================
    // FIND CATEGORY
    // ======================
    const categoryIndex = categories.findIndex(
      (item) => Number(item.id) === Number(id)
    );

    // ======================
    // NOT FOUND
    // ======================
    if (categoryIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Category Not Found",
        },
        { status: 404 }
      );
    }

    // ======================
    // UPDATE DATA
    // ======================
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      title: body.title,
      slug: body.slug,
      metaTitle: body.metaTitle
        ?.replace(/<[^>]*>/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim() || "",
      metaDescription: body.metaDescription
        ?.replace(/<[^>]*>/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim() || "",
      parent: body.parent,
      status: body.status,
      updatedAt: new Date().toISOString(),
    };

    // ======================
    // SAVE FILE
    // ======================
    writeData("categories.json", categories);

    // ======================
    // RESPONSE
    // ======================
    return NextResponse.json({
      success: true,
      message: "Category Updated Successfully",
      category: categories[categoryIndex],
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ======================
// DELETE CATEGORY
// ======================
export async function DELETE(req, context) {
  const admin = await getAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Please login first",
      },
      { status: 401 }
    );
  }

  if (
    admin.role !== "admin" &&
    !admin?.permissions?.categories?.delete
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Permission denied",
      },
      { status: 403 }
    );
  }

  try {
    // ======================
    // GET ID
    // ======================
    const params = await context.params;
    const id = params.id;

    // ======================
    // READ FILE
    // ======================
    const categories = readData("categories.json");

    const category = categories.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category Not Found",
        },
        { status: 404 }
      );
    }

    // ======================
    // FILTER DATA
    // ======================
    const filteredCategories = categories.filter(
      (item) => Number(item.id) !== Number(id)
    );

    // ======================
    // SAVE FILE
    // ======================
    writeData("categories.json", filteredCategories);

    // ======================
    // RESPONSE
    // ======================
    return NextResponse.json({
      success: true,
      message: "Category Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}