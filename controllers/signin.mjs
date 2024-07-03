// модуль создает токен
import pkg from "jsonwebtoken";
// кастомные классы ошибок
import InvalidDataError from "../errors/invalid-data-error.mjs";
import User from "../models/user.mjs";

const { sign } = pkg;
// подключаем environment переменные
const { NODE_ENV, JWT_SECRET } = process.env;

// контроллер аутентификации пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new InvalidDataError("Заполните поля корректно"));
  }

  // поиск в бд документа по емайлу, а потом сверяем пароль (хеш)
  // данный метод берется с свойства statics схемы User
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      // первый аргумент это пейлоуд, т.е. что будет использоваться для создания хеша
      const token = sign(
        // пейлоуд
        { _id: user._id },
        // секретный ключ
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        // объект опций
        {
          // срок действия токена
          expiresIn: "7d",
        }
      );

      // вернем токен
      res.send({ token });
    })
    .catch(next);
};

export { login };
