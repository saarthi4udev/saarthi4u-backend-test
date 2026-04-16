const nodemailer = require("nodemailer");
const path = require("node:path");

const sendMail = async ({
  to,
  subject,
  template,
  context = {},
}) => {
  try {
    const hbs = (await import("nodemailer-express-handlebars")).default;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views"),
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));

    const mailOptions = {
      from: `Saarthi4u <${process.env.EMAIL_ID}>`,
      to,
      subject,
      template,
      context: {
        year: new Date().getFullYear(),
        ...context,
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent:", info.messageId);

    return info;
  } catch (err) {
    console.error("❌ Mail error:", err);
    throw err;
  }
};

module.exports = sendMail;