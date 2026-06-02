import fs from "fs";

import path from "path";

import { NextResponse }
  from "next/server";

export async function POST(
  req
) {

  try {

    const data =
      await req.formData();

    const file =
      data.get("file");

    if (!file) {

      return NextResponse.json(
        {
          success: false,
          message:
            "No File Uploaded",
        },
        { status: 400 }
      );
    }




    // IMAGE TYPE

    const allowedTypes = [

      "image/jpeg",

      "image/jpg",

      "image/png",

      "image/webp",

      "image/gif",

      "image/svg",

    ];

    if (

      !allowedTypes.includes(
        file.type
      )

    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Only image files are allowed",
        },
        {
          status: 400,
        }
      );
    }




    // FILE SIZE

    const maxSize =
      5 * 1024 * 1024;

    if (
      file.size >
      maxSize
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Image size must be less than 5 MB",
        },
        {
          status: 400,
        }
      );
    }



    // BUFFER

    const bytes =
      await file.arrayBuffer();






    const buffer =
      Buffer.from(bytes);




    // FILE NAME

    const fileName =
      `${Date.now()}-${file.name}`;




    // PATH

    const uploadPath =
      path.join(
        process.cwd(),
        "public/uploads",
        fileName
      );




    // SAVE FILE

    fs.writeFileSync(
      uploadPath,
      buffer
    );




    return NextResponse.json({
      success: true,

      imageUrl:
        `/uploads/${fileName}`,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Upload Failed",
      },
      { status: 500 }
    );
  }
}