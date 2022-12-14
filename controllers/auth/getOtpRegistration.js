import { db } from "../../models/index.js";
import { sendOtp } from "./index.js";

export default async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).send({ message: "Email not found." });
    }

    const user = await db.User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(400).send({ message: "User already exists." });
    }

    await sendOtp(req, res, "register");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
