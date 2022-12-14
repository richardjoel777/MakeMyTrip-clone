import { db } from "../../models/index.js";

const Tag = db.Tag;

export default async (req, res) => {
  try {
    const tags = await Tag.findAll({
      where: { type: "picture" },
    });
    res.status(200).send(tags);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
