import crypto from "node:crypto"; // хеширование данных
import User from "../models/user.mjs"; // импорт модели User

// кастомные классы ошибок
import InvalidDataError from "../errors/invalid-data-error.mjs";
import ConflictError from "../errors/conflict-error.mjs";

// авторизация
// добавление нового пользователя в базу данных
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  User.create({
    name,
    email,
    password: hash,
  })
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new InvalidDataError("При регистрации пользователя произошла ошибка")
        );
      }
      if (err.code === 11000) {
        next(new ConflictError("Пользователь с таким email уже существует"));
      }
      return next(err);
    });
};

export { createUser };
