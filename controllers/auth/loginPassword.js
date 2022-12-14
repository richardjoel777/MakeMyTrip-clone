import { loginUser } from "./index.js";
import bcrypt from "bcryptjs";
import Joi from "@hapi/joi";
import { db } from "../../models/index.js";

const User = db.User;

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password"
    )
    .required(),
});

export default async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found." });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid password." });
    }
    loginUser(req, res, user.id);
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
};
