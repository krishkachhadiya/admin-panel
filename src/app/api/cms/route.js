import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/filehandler";
import { getAdmin } from "@/lib/auth";
import { createSlug } from "@/lib/slug";

// ======================
// GET CMS
// ======================
export async function GET() {
  try {
    const cms = readData("cms.json");

    return NextResponse.json(cms);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}

// ======================
// CREATE CMS
// ======================
export async function POST(req) {
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
    !admin?.permissions?.cms?.create
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
    const body = await req.json();

    let {
      title,
      slug,
      metaTitle,
      metaDescription,
      content,
      status,
    } = body;

    // ======================
    // VALIDATION
    // ======================
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Page title required",
        },
        { status: 400 }
      );
    }

    // ======================
    // CLEAN VALUES
    // ======================
    title = title.trim();
    slug = slug?.trim().toLowerCase() || "";

    // ======================
    // READ CMS
    // ======================
    const cms = readData("cms.json");

    // ======================
    // CREATE UNIQUE SLUG
    // ======================
    const uniqueSlug = createSlug({
      text: slug || title,
      items: cms,
    });

    // ======================
    // CHECK TITLE EXISTS
    // ======================
    const alreadyExists = cms.find(
      (item) => item.title?.toLowerCase() === title.toLowerCase()
    );

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "CMS page already exists",
        },
        { status: 400 }
      );
    }

    // ======================
    // CREATE PAGE
    // ======================
    const newPage = {
      id: Date.now(),
      title,
      slug: uniqueSlug,
      metaTitle: metaTitle
        ?.replace(/<[^>]*>/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim() || "",
      metaDescription: metaDescription
        ?.replace(/<[^>]*>/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim() || "",
      content: content || "",
      status: status || "active",
      createdAt: new Date().toISOString(),
    };

    // ======================
    // PUSH PAGE
    // ======================
    cms.push(newPage);

    // ======================
    // SAVE FILE
    // ======================
    writeData("cms.json", cms);

    // ======================
    // RESPONSE
    // ======================
    return NextResponse.json({
      success: true,
      message: "CMS Page Created Successfully",
      page: newPage,
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