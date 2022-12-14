import { db } from "../../models/index.js";

export default async (req, res) => {
  try {
    const cities = await db.Address.findAll({
      attributes: [
        [db.Sequelize.fn("lower", db.Sequelize.col("city")), "city"],
        [db.Sequelize.fn("count", db.Sequelize.col("id")), "count"],
      ],
      group: ["city"],
    });
    res.status(200).send(cities);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
