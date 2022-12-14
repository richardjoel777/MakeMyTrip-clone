import { loginUser } from "./index.js";
import Joi from "@hapi/joi";
import { db } from "../../models/index.js";

const User = db.User;
const Otp = db.Otp;

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export default async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return res.status(400).send({ message: "User not found." });
  }

  const otpObj = await Otp.findOne({
    where: { otp: req.body.otp, email: req.body.email },
  });

  console.log(otpObj);

  if (!otpObj) {
    return res.status(400).send({ message: "OTP not found." });
  }

  if (otpObj.verified) {
    return res.status(400).send({ message: "OTP already verified." });
  }

  if (new Date(otpObj.expireAt) < new Date()) {
    console.log(new Date(otpObj.expireAt));
    return res.status(400).send({ message: "OTP expired." });
  }

  await otpObj.update({ verified: true });

  loginUser(req, res, user.id);
};
