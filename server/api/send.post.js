import nodemailer from "nodemailer";
export default defineEventHandler(async (event) => {
  // const body = await readBody(event)
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.example.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: precess.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  try {
    await transporter.sendMail({
      from: '"HSTD Conference" <example@example.com>', // sender address
      to: "example@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "", // plain text body
      html: "<b>Hello</b>", // html body
    });
    return "ok";
  } catch (error) {
    return error;
  }
});
