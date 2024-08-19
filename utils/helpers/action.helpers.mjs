import * as fs from "fs";

export async function deleteFile(tempPath) {
  if (fs.existsSync(tempPath)) {
    await fs.unlink(tempPath, (err) => {
      if (err) throw err;
    });
  }
}
