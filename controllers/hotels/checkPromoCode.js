import { db } from "../../models/index.js";

export default async (req, res) => {
  try {
    const promocode = await db.PromoCode.findOne({
      where: {
        code: req.body.promocode,
      },
      include: [
        {
          model: db.Hotel,
          as: "hotels",
          where: {
            id: req.body.hotelId,
          },
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!promocode) {
      return res
        .status(404)
        .send({ exists: false, message: "Promo code not found." });
    }

    res.status(200).send({ exists: true, message: "Promocode Found" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
