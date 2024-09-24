import { transliterate as tr } from "transliteration";

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function transliterate(text) {
  return tr(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getNameAndFormatImage(url) {
  // Разделяем URL на части по символу '/'
  const parts = url.split("/");

  // Получаем последний элемент массива, который содержит имя файла с расширением
  const fileNameWithExtension = parts[parts.length - 1];

  // Разделяем имя файла и расширение по символу '.'
  return fileNameWithExtension.split(".");
}
