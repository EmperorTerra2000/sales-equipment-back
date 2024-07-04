// загружает файл .env в Node.js
import { config } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
// import { renderFile } from "ejs";
import { errors } from "celebrate";
import NotFoundError from "../errors/not-found-error.mjs";
import cors from "../middlewares/cors.mjs";
import { requestLogger, errorLogger } from "../middlewares/logger.mjs";
import { routerCategory } from "../routes/index.mjs";

config();

// подключаем environment переменные
const { NODE_ENV, JWT_SECRET, DB_ROUTE } = process.env;

const { PORT = 3030 } = process.env;

let total = 0;

const app = express();

const __filename = fileURLToPath(import.meta.url);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приема страниц внутри POST-запроса

// промежуточный обработка сookie-parser
// исполь-ся для шифрования значений файлов перед их отправкой клиенту
app.use(cookieParser(NODE_ENV === "production" ? JWT_SECRET : "dev-secret"));

// Логгер запросов нужно подключить до всех обработчиков роутов
app.use(requestLogger); // подключаем логгер запросов

app.use(cors); // обработка кросс-доменных запросов

// app.get("/", (req, res) => {
//   // Render page using renderFile method
//   renderFile(
//     path.join(__dirname, "./index.ejs"),
//     {},
//     {},
//     function (err, template) {
//       if (err) {
//         throw err;
//       } else {
//         res.end(template);
//       }
//     }
//   );

//   // res.send("The sedulous hyena ate the antelope!");
// });

app.use(routerCategory);

app.get("/", (req, res) => {
  total += 1;

  console.log(total);

  res.send("<h1>HOOOOME</h1>");
});

// обработка запроса на несуществующий роут
app.use((req, res, next) => {
  next(new NotFoundError("404 Страница по указанному маршруту не найдена."));
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчки ошибок celebrate
app.use(errors());

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(message);
  console.log(statusCode);
  res.status(statusCode).send({
    message: statusCode === 500 ? "500 На сервере произошла ошибка." : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening ob port ${PORT}`);
});
