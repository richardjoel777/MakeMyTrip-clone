import es from '../../config/es.js';
import bodybuilder from 'bodybuilder';

import { db } from '../../models/index.js';

const Hotel = db.Hotel;
const Room = db.Room;
const Picture = db.Picture;
const Tag = db.Tag;
const Amenity = db.Amenity;
const PropertyRule = db.PropertyRule;
const Review = db.Review;
const Address = db.Address;
const User = db.User;
const Description = db.Description;

const Op = db.Sequelize.Op;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default async (req, res) => {
  try {
    let body = bodybuilder();

    if (req.query.city) {
      body = body.query('match', 'address.city', req.query.city);
    }
    if (req.query.state) {
      body = body.query('match', 'address.state', req.query.state);
    }

    const priceIds = new Set();
    const amenitiesIds = new Set();
    const propertyRuleIds = new Set();

    let priceFiltered = false;
    let amenitiesFiltered = false;
    let propertyRuleFiltered = false;

    if (req.query.minPrice && req.query.maxPrice) {
      priceFiltered = true;
      const rooms = await Room.findAll({
        attributes: ['hotelId'],
        where: {
          price: {
            [Op.lte]: req.query.maxPrice,
            [Op.gte]: req.query.minPrice,
          },
        },
      });

      console.log(rooms);

      rooms.forEach((room) => {
        priceIds.add(room.hotelId.toString());
      });
    } else if (req.query.minPrice) {
      priceFiltered = true;
      const rooms = await Room.findAll({
        attributes: ['hotelId'],
        where: {
          price: {
            [Op.gte]: req.query.minPrice,
          },
        },
      });

      rooms.forEach((room) => {
        priceIds.add(room.hotelId.toString());
      });
    } else if (req.query.maxPrice) {
      priceFiltered = true;
      const rooms = await Room.findAll({
        attributes: ['hotelId'],
        where: {
          price: {
            [Op.lte]: req.query.maxPrice,
          },
        },
      });

      rooms.forEach((room) => {
        priceIds.add(room.hotelId.toString());
      });
    }

    if (
      !req.query.minPrice &&
      !req.query.maxPrice &&
      req.query.minRange &&
      req.query.maxRange
    ) {
      priceFiltered = true;
      if (!Array.isArray(req.query.minRange)) {
        req.query.minRange = [req.query.minRange];
      }
      if (!Array.isArray(req.query.maxRange)) {
        req.query.maxRange = [req.query.maxRange];
      }

      console.log(req.query.minRange, req.query.maxRange);
      for (let i = 0; i < req.query.minRange.length; i++) {
        const rooms = await Room.findAll({
          attributes: ['hotelId'],
          where: {
            price: {
              [Op.between]: [req.query.minRange[i], req.query.maxRange[i]],
            },
          },
        });

        rooms.forEach((room) => {
          priceIds.add(room.hotelId.toString());
        });
      }
    }

    if (req.query.starCategory) {
      if (!Array.isArray(req.query.starCategory)) {
        req.query.starCategory = [req.query.starCategory];
      }

      body = body.filter('terms', 'starCategory', req.query.starCategory);
    }

    if (req.query.search) {
      body = body.query('match', 'name', req.query.search);
    }

    if (req.query.bedCount) {
      body = body.filter('term', 'bedCount', req.query.bedCount);
    }

    if (req.query.propertyRules) {
      propertyRuleFiltered = true;
      if (!Array.isArray(req.query.PropertyRules)) {
        req.query.PropertyRules = [req.query.PropertyRules];
      }
      const hotels = await Hotel.findAll({
        attributes: ['id'],
        include: [
          {
            model: PropertyRule,
            attributes: ['id'],
            as: 'propertyRules',
            where: {
              id: {
                [Op.in]: req.query.propertyRules,
              },
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      hotels.forEach((hotel) => {
        propertyRuleIds.add(hotel.id.toString());
      });
    }

    if (req.query.amenities) {
      amenitiesFiltered = true;
      if (!Array.isArray(req.query.Amenities)) {
        req.query.Amenities = [req.query.Amenities];
      }
      const rooms = await Room.findAll({
        attributes: ['hotelId'],
        include: [
          {
            model: Amenity,
            attributes: ['id'],
            as: 'amenities',
            where: {
              id: {
                [Op.in]: req.query.amenities,
              },
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      rooms.forEach((room) => {
        amenitiesIds.add(room.hotelId.toString());
      });
    }

    if (req.query.minRating) {
      body = body.filter('range', 'avgRating', {
        gte: req.query.minRating,
      });
    }

    if (priceFiltered && amenitiesFiltered && propertyRuleFiltered) {
      const intersection = new Set(
        [...priceIds].filter(
          (x) => amenitiesIds.has(x) && propertyRuleIds.has(x)
        )
      );
      body = body.filter('ids', 'values', [...intersection]);
    } else if (priceFiltered && amenitiesFiltered) {
      const intersection = new Set(
        [...priceIds].filter((x) => amenitiesIds.has(x))
      );
      console.log(intersection, priceIds, amenitiesIds);
      body = body.filter('ids', 'values', [...intersection]);
    } else if (priceFiltered && propertyRuleFiltered) {
      const intersection = new Set(
        [...priceIds].filter((x) => propertyRuleIds.has(x))
      );
      body = body.filter('ids', 'values', [...intersection]);
    } else if (amenitiesFiltered && propertyRuleFiltered) {
      const intersection = new Set(
        [...amenitiesIds].filter((x) => propertyRuleIds.has(x))
      );
      body = body.filter('ids', 'values', [...intersection]);
    } else if (priceFiltered) {
      console.log(priceIds);
      body = body.filter('ids', 'values', [...priceIds]);
    } else if (amenitiesFiltered) {
      body = body.filter('ids', 'values', [...amenitiesIds]);
      console.log([...amenitiesIds]);
    } else if (propertyRuleFiltered) {
      body = body.filter('ids', 'values', [...propertyRuleIds]);
    }

    body = body.build();

    console.log(JSON.stringify(body, null, 2));

    const offset = req.query.offset ? req.query.offset : 0;

    const hotels = await es.search({
      index: 'hotels',
      body,
      _source: {
        excludes: [
          'description',
          'reviews',
          'propertyRules',
          'amenities',
          'reviews',
        ],
      },
      from: offset,
      size: 10,
    });

    console.log(hotels.hits.total);

    return res.send(
      hotels.hits.hits.map((hotel) => {
        return { id: hotel._id, ...hotel._source };
      })
    );

    // console.log(hotels);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ message: error.message });
  }
};
