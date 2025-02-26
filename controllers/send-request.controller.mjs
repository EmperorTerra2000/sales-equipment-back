import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

class SendRequestController {
  async send(req, res) {
    const { NODEMAILER_USER, NODEMAILER_PASS, LIST_EMAIL } = process.env;
    const {
      manufactured,
      inn,
      name_org,
      contact_person,
      email,
      phone,
      additional_info,
    } = req.body;

    try {
      // авторизация к SMTP серверу
      let transporter = nodemailer.createTransport({
        host: "connect.smtp.bz",
        port: 2525,
        secure: false,
        auth: {
          user: NODEMAILER_USER,
          pass: NODEMAILER_PASS,
        },
      });
      // отправка самого письма
      await transporter.sendMail({
        from: `"ENGINEERING INTELLIGENCE TEAM" <noreply@idlepshokoff.com>`,
        to: LIST_EMAIL,
        subject: "Заказ",
        text: `${req.body}`,
        html: `
        <ul>
          <li>Производитель оборудования: ${manufactured}</li>
          <li>ИНН: ${inn}</li>
          <li>Наименование организации: ${name_org}</li>
          <li>Контактное лицо: ${contact_person}</li>
          <li>Email: ${email}</li>
          <li>Телефон: ${phone}</li>
          <li>Информация об оборудовании (бренд, артикул или серийный номер, количество): ${additional_info}</li>
        </ul>`,
      });

      res.status(200).json("successful");
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: err.message,
      });
    }
  }
}

export default new SendRequestController();
