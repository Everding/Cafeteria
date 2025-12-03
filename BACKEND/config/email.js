import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "everdinglol@gmail.com",
    pass: "kjfd xgfx gblv ienv",
  },
});