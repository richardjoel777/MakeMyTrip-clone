import { db } from "../../models/index.js";
import { sendOtp } from "./index.js";

const User = db.User;

export default async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: "Email is required" });
  }

  console.log(req.body.email);

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  console.log("User here", user);

  if (!user) {
    return res.status(400).send({ message: "User not found." });
  }

  await sendOtp(req, res, "reset");
};
