import nodemailer from "nodemailer";
export default function (
  method_data: string,
  failedWebSites: { host: string; status: string }[],
  time: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transporter
    .sendMail({
      from: "amin@teenagedream.ir",
      to: method_data,
      subject: "Down Websites",
      html: `
    <h1>Date: ${time}</h1></br>
    <h1 style="color:red;">Down Alert for this websites:</h1></br>
  ${failedWebSites.map((sites) => `<h2>${sites.host}</h2></br>`)}`,
    })
    .then(() => console.log("OK, Email has been sent."))
    .catch(console.error);
}
