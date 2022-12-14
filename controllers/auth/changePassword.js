import bcrypt from "bcryptjs";
import Joi from "@hapi/joi";
import { Op } from "sequelize";
import { db } from "../../models/index.js";

const User = db.User;
const Otp = db.Otp;

const changePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  oldPassword: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password"
    )
    .required(),
  newPassword: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password"
    )
    .required(),
});

export default async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
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

    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!validPassword) {
      return res.status(400).send({ message: "Invalid password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    await user.update({
      password: hashedPassword,
    });

    res.status(200).send({ message: "Password changed successfully." });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};
