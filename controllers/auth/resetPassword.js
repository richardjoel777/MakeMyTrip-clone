import bcrypt from "bcryptjs";
import Joi from "@hapi/joi";
import { Op } from "sequelize";
import { db } from "../../models/index.js";

const User = db.User;
const Otp = db.Otp;

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password"
    )
    .required(),
  otp: Joi.string().required(),
});

export default async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
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

    const otp = await Otp.findOne({
      where: {
        otp: req.body.otp,
        email: req.body.email,
        verified: false,
        expireAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!otp) {
      return res.status(400).send({ message: "Invalid OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await user.update({
      password: hashedPassword,
    });

    await otp.update({
      verified: true,
    });

    res.status(200).send({ message: "Password changed successfully." });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};
