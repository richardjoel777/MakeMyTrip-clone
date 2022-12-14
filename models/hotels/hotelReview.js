import es from "../../config/es.js";
import { db } from "../index.js";

export default (sequelize, { DataTypes }) => {
  async function saveDocument(instance) {
    const hotel = await db.Hotel.findOne({
      where: {
        id: instance.dataValues.hotelId,
      },
      attributes: ["id", "avgRating", "totalReviews", "totalRating"],
    });

    hotel.totalReviews += 1;
    hotel.totalRating += instance.rating;
    hotel.avgRating = +(hotel.totalRating / hotel.totalReviews).toFixed(1);

    await es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "if (!ctx._source.containsKey('reviews')) ctx._source.reviews= new ArrayList(); ctx._source.reviews.add(params.review);",
          lang: "painless",
          params: {
            review: {
              ...instance.dataValues,
            },
          },
        },
      },
    });

    await es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "ctx._source.totalReviews = params.totalReviews; ctx._source.totalRating = params.totalRating; ctx._source.avgRating = params.avgRating;",
          lang: "painless",
          params: {
            totalReviews: hotel.totalReviews,
            totalRating: hotel.totalRating,
            avgRating: hotel.avgRating,
          },
        },
      },
    });
    await hotel.save();
  }

  async function updateDocument(instance) {
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "for(int i=0;i<ctx._source.reviews.size();i++){if(ctx._source.reviews[i].id.equals(params.review.id)){ctx._source.reviews[i]=params.review}}",
          lang: "painless",
          params: {
            review: {
              ...instance.dataValues,
            },
          },
        },
      },
    });
  }

  async function deleteDocument(instance) {
    const hotel = await db.Hotel.findOne({
      where: {
        id: instance.dataValues.hotelId,
      },
      attributes: ["avgRating", "totalReviews", "totalRating"],
    });

    hotel.totalReviews -= 1;
    hotel.totalRating -= instance.dataValues.rating;
    hotel.avgRating = +(hotel.totalRating / hotel.totalReviews).toFixed(1);

    await es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          lang: "painless",
          source:
            "for (int i = 0; i < ctx._source.reviews.length; ++i) {if (ctx._source.reviews[i]['id'] == params['id']) {ctx._source.reviews.remove(i);}}",
          params: { id: instance.dataValues.id },
        },
      },
    });

    await es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "ctx._source.totalReviews = params.totalReviews; ctx._source.totalRating = params.totalRating; ctx._source.avgRating = params.avgRating;",
          lang: "painless",
          params: {
            totalReviews: hotel.totalReviews,
            totalRating: hotel.totalRating,
            avgRating: hotel.avgRating,
          },
        },
      },
    });

    return hotel.save();
  }

  const HotelReview = sequelize.define(
    "HotelReview",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [[1, 2, 3, 4, 5]],
            msg: "Star category must be between 1 and 5",
          },
        },
      },
    },
    {
      hooks: {
        afterCreate: saveDocument,
        afterUpdate: updateDocument,
        afterDestroy: deleteDocument,
      },
    }
  );
  return HotelReview;
};
