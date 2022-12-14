import { db } from "../../models/index.js";

const Tag = db.Tag;

const Amenity = db.Amenity;

export default async (req, res) => {
  try {
    const amenities = await Amenity.findAll({
      include: [
        {
          model: Tag,
          as: "tag",
        },
      ],
    });

    res.status(200).send(amenities);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
