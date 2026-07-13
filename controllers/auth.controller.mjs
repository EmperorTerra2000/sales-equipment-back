import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import db from "../src/db.mjs";

config();

const { JWT_SECRET } = process.env;

class AuthController {
  login = async (req, res) => {
    const { login, password } = req.body;

    try {
      const result = await db.query("SELECT * FROM admins WHERE login = $1", [login]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
      }

      const token = jwt.sign(
        { id: user.id, login: user.login },
        JWT_SECRET,
        { expiresIn: "180d" }
      );

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };

  register = async (req, res) => {
    const { login, password } = req.body;

    try {
      const existing = await db.query("SELECT id FROM admins WHERE login = $1", [login]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ message: "Пользователь уже существует" });
      }

      const hash = await bcrypt.hash(password, 10);
      const result = await db.query(
        "INSERT INTO admins (login, password_hash) VALUES ($1, $2) RETURNING id, login, created_at",
        [login, hash]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };
}

export default new AuthController();
