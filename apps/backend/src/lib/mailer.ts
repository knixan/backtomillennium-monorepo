import nodemailer from "nodemailer";

import { env } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  await transporter.sendMail({
    from: env.GMAIL_USER,
    to,
    subject,
    html,
  });
}
