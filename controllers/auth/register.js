import Joi from "@hapi/joi";
import { db } from "../../models/index.js";
import { loginUser } from "./index.js";

const User = db.User;
const Profile = db.Profile;
const Otp = db.Otp;

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export default async (req, res) => {
  console.log(req.body);

  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
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

  const user = new User({
    email: req.body.email,
  });

  try {
    const savedUser = await user.save();
    const profile = new Profile({
      userId: savedUser.id,
    });
    await profile.save();
    loginUser(req, res, savedUser.id);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
