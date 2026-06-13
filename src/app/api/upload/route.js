import fs from "fs";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No File Uploaded" },
        { status: 400 }
      );
    }

    // IMAGE TYPE VALIDATION
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // FILE SIZE VALIDATION
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "Image size must be less than 5 MB" },
        { status: 400 }
      );
    }

    // CONVERT TO BUFFER
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. GENERATE THE HASH FOR THE UPLOADED FILE
    const currentFileHash = crypto.createHash("md5").update(buffer).digest("hex");

    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. CHECK IF THIS EXACT IMAGE CONTENT ALREADY EXISTS
    const existingFiles = fs.readdirSync(uploadDir);
    let duplicateFileName = null;

    for (const existingFile of existingFiles) {
      const existingFilePath = path.join(uploadDir, existingFile);
      
      // Skip directories, only check files
      if (fs.statSync(existingFilePath).isFile()) {
        const fileBuffer = fs.readFileSync(existingFilePath);
        const existingFileHash = crypto.createHash("md5").update(fileBuffer).digest("hex");

        // If the content hashes match, we found our duplicate!
        if (currentFileHash === existingFileHash) {
          duplicateFileName = existingFile;
          break;
        }
      }
    }

    // 3. IF DUPLICATE IS FOUND, RETURN ITS PATH WITHOUT SAVING A NEW FILE
    if (duplicateFileName) {
      return NextResponse.json({
        success: true,
        message: "Duplicate image content detected. Reusing existing file.",
        imageUrl: `/uploads/${duplicateFileName}`,
      });
    }

    // 4. IF IT'S A NEW IMAGE, HANDLE POTENTIAL NAME COLLISIONS
    // (In case a completely different image shares the same name)
    let finalFileName = file.name;
    let uploadPath = path.join(uploadDir, finalFileName);
    const fileExtension = path.extname(file.name);
    const baseName = path.basename(file.name, fileExtension);
    let counter = 1;

    while (fs.existsSync(uploadPath)) {
      finalFileName = `${baseName}-${counter}${fileExtension}`;
      uploadPath = path.join(uploadDir, finalFileName);
      counter++;
    }

    // SAVE THE NEW FILE
    fs.writeFileSync(uploadPath, buffer);

    return NextResponse.json({
      success: true,
      message: "New image uploaded successfully.",
      imageUrl: `/uploads/${finalFileName}`,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Upload Failed" },
      { status: 500 }
    );
  }
}