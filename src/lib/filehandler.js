import fs from "fs";
import path from "path";

export function readData(fileName) {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      fileName
    );

    const data = fs.readFileSync(
      filePath,
      "utf-8"
    );

    return JSON.parse(data);
  } catch (error) {
    console.log(error);

    return [];
  }
}

export function writeData(fileName, data) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    fileName
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );
}