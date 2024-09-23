import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootPath = path.resolve(__dirname, "../..");

export async function deleteFile(tempPath) {
  if (fs.existsSync(tempPath)) {
    await fs.unlink(tempPath, (err) => {
      if (err) throw err;
    });
  }
}

export async function downloadFile(req, data, pathName) {
  if (!req.file) {
    return;
  }

  try {
    const { path: tempPath, originalname, filename } = req.file;

    const targetPath = path.join(__rootPath, `uploads/${pathName}/${filename}`);

    await sharp(tempPath).toFile(targetPath);
    await deleteFile(tempPath);

    data.image = filename;
  } catch (err) {
    console.error(err);
  }
}
