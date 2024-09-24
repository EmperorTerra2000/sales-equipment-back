import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import * as https from "https";
import { getNameAndFormatImage } from "./formatter.helpers.mjs";

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

export async function downloadFileV2(data, filename, pathName) {
  try {
    const tempPath = path.join(__rootPath, `uploads/${filename}`);
    const targetPath = path.join(__rootPath, `uploads/${pathName}/${filename}`);

    await sharp(tempPath).toFile(targetPath);
    await deleteFile(tempPath);

    data.image = filename;
  } catch (err) {
    console.error(err);
  }
}

export async function downloadFileHttps(imageUrl) {
  return new Promise((resolve, reject) => {
    // Создаем запрос на загрузку изображения
    https
      .get(imageUrl, (response) => {
        // Проверяем, что статус код 200 (OK)
        if (response.statusCode >= 200 && response.statusCode < 300) {
          const [_, fileExtension] = getNameAndFormatImage(response.req.path);
          const nameFile = `${Date.now()}.${fileExtension}`;
          const savePath = `./uploads/${nameFile}`;
          // Создаем поток записи для сохранения изображения
          const fileStream = fs.createWriteStream(savePath);
          // Перенаправляем данные из ответа в поток записи
          response.pipe(fileStream);

          // Обработка события завершения записи
          fileStream.on("finish", () => {
            fileStream.close();
            console.log("Изображение успешно загружено и сохранено.");
            resolve(nameFile);
          });
        } else {
          console.error(
            `Ошибка при загрузке изображения: ${response.statusCode}`
          );
          reject(
            new Error(`Ошибка при загрузке изображения: ${response.statusCode}`)
          );
        }
      })
      .on("error", (err) => {
        console.error(`Ошибка при загрузке изображения: ${err.message}`);
        reject(new Error(`Ошибка при загрузке изображения: ${err.message}`));
      });
  });
}
