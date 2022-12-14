import { db } from "../../models/index.js";

const User = db.User;

export default async (req, res) => {

  if(!req.body.email) return res.status(400).send({message: "Email is required."});

  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(200).send({
        exists: false,
        message: "User Not found.",
      });
    }
    res.status(200).send({
      exists: true,
      message: "User found.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
