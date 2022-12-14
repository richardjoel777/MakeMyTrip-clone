import { db } from "../../models/index.js";

const Hotel = db.Hotel;

export default async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(200).send(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
