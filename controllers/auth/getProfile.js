import { db } from "../../models/index.js";

const Profile = db.Profile;

export default async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.userId },
    });
    res.status(200).send(profile);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
