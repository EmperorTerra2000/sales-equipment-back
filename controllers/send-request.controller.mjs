import nodemailer from "nodemailer";

class SendRequestController {
  async send(req, res) {
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
          user: "abramov_trofim@mail.ru",
          pass: "tDGGzPC7UEfX",
        },
      });
      // отправка самого письма
      await transporter.sendMail({
        from: `"ENGINEERING INTELLIGENCE TEAM" <info@idlepshokoff.com>`,
        to: "abramov_trofim@mail.ru, troha1994@gmail.com, partsales796@gmail.com",
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
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

export default new SendRequestController();
