import { db } from "../../models/index.js";

const Tag = db.Tag;
const PropertyRule = db.PropertyRule;

export default async (req, res) => {
  try {
    const propertyRules = await PropertyRule.findAll({
      include: [
        {
          model: Tag,
          as: "tag",
        },
      ],
    });
    res.status(200).send(propertyRules);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
