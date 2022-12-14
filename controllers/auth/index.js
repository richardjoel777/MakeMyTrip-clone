import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import authConfig from "../../config/auth.js";
import { db } from "../../models/index.js";
import emailTemplate from "../../helpers/emailTemplate.js";

const Otp = db.Otp;

import checkUser from "./checkUser.js";
import getOtpResetPassword from "./getOtpResetPassword.js";
import changePassword from "./changePassword.js";
import getProfile from "./getProfile.js";
import getOtpRegistration from "./getOtpRegistration.js";
import loginPassword from "./loginPassword.js";
import loginOtp from "./loginOtp.js";
import logout from "./logout.js";
import profile from "./profile.js";
import register from "./register.js";
import resetPassword from "./resetPassword.js";
import getOtpLogin from "./getOtpLogin.js";

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export const loginUser = async (req, res, id) => {
  const token = jwt.sign({ id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
  res
    .setHeader("Set-Cookie", `jwt=${token};Path=/;HttpOnly`)
    .status(200)
    .send({ token, message: "Login Successful" });
};

export const sendOtp = async (req, res, type) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpData = await Otp.create({
      otp,
      email: req.body.email,
      expireAt: AddMinutesToDate(new Date(), authConfig.otpExpiresIn),
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: authConfig.mailingEmail,
        pass: authConfig.mailingPassword,
      },
    });

    await transporter.verify();

    const { subject, body } = emailTemplate(otp, "verify");

    const mailOptions = {
      from: authConfig.mailingEmail,
      to: req.body.email,
      subject: subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .send({ otpId: otpData.id, message: "Otp sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

export default {
  loginOtp,
  loginPassword,
  resetPassword,
  changePassword,
  checkUser,
  getProfile,
  getOtpResetPassword,
  getOtpRegistration,
  getOtpLogin,
  logout,
  profile,
  register,
};
