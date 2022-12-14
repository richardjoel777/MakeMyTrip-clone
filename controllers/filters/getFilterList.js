import { db } from '../../models/index.js';

import es from '../../config/es.js';
import bodybuilder from 'bodybuilder';
import { Op } from 'sequelize';

import v8 from 'v8';

const structuredClone = (obj) => {
  return v8.deserialize(v8.serialize(obj));
};

const Amenity = db.Amenity;
const PropertyRule = db.PropertyRule;
const Hotel = db.Hotel;
const Room = db.Room;

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
        priceIds.add(room.hotelId.toString().toString());
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
      if (!Array.isArray(req.query.propertyRules)) {
        req.query.propertyRules = [req.query.propertyRules];
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
      if (!Array.isArray(req.query.amenities)) {
        req.query.amenities = [req.query.amenities];
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

    let intersection = new Set();

    if (priceFiltered && amenitiesFiltered && propertyRuleFiltered) {
      intersection = new Set(
        [...priceIds].filter(
          (x) => amenitiesIds.has(x) && propertyRuleIds.has(x)
        )
      );
      body = body.filter('ids', 'values', [...intersection]);
    } else if (priceFiltered && amenitiesFiltered) {
      intersection = new Set([...priceIds].filter((x) => amenitiesIds.has(x)));
      console.log(intersection, priceIds, amenitiesIds);
      body = body.filter('ids', 'values', [...intersection]);
    } else if (priceFiltered && propertyRuleFiltered) {
      intersection = new Set(
        [...priceIds].filter((x) => propertyRuleIds.has(x))
      );
      body = body.filter('ids', 'values', [...intersection]);
    } else if (amenitiesFiltered && propertyRuleFiltered) {
      intersection = new Set(
        [...amenitiesIds].filter((x) => propertyRuleIds.has(x))
      );
      body = body.filter('ids', 'values', [...intersection]);
    } else if (priceFiltered) {
      intersection = priceIds;
      body = body.filter('ids', 'values', [...priceIds]);
    } else if (amenitiesFiltered) {
      intersection = amenitiesIds;
      body = body.filter('ids', 'values', [...amenitiesIds]);
      console.log([...amenitiesIds]);
    } else if (propertyRuleFiltered) {
      intersection = propertyRuleIds;
      body = body.filter('ids', 'values', [...propertyRuleIds]);
    }

    console.log(JSON.stringify(body.build()));

    const prices = [
      {
        min: 0,
        max: 4000,
      },
      {
        min: 4000,
        max: 8000,
      },
      {
        min: 8000,
        max: 12000,
      },
      {
        min: 12000,
        max: 15000,
      },
      {
        min: 15000,
        max: 30000,
      },
      {
        min: 30000,
        max: 100000,
      },
    ];

    for (let i = 0; i < prices.length; i++) {
      const tempBody = body.build();
      const filterPriceIds = new Set();
      const rooms = await Room.findAll({
        attributes: ['hotelId'],
        where: {
          price: {
            [Op.between]: [prices[i].min, prices[i].max],
          },
        },
      });

      rooms.forEach((room) => {
        filterPriceIds.add(room.hotelId.toString());
      });

      if (!priceFiltered && !amenitiesFiltered && !propertyRuleFiltered) {
        if (!tempBody.query) {
          tempBody.query = {
            bool: {
              filter: {
                ids: {
                  values: [...filterPriceIds],
                },
              },
            },
          };
        } else if (!tempBody.query.bool) {
          tempBody.query.bool = {
            filter: {
              ids: {
                values: [...filterPriceIds],
              },
            },
          };
        } else if (!tempBody.query.bool.filter) {
          tempBody.query.bool.filter = {
            ids: {
              values: [...filterPriceIds],
            },
          };
        } else {
          tempBody.query.bool.filter.ids = {
            values: [...filterPriceIds],
          };
        }
      } else {
        console.log(intersection.size, filterPriceIds.size);
        tempBody.query.bool.filter.ids = {
          values: [...intersection].filter((x) => filterPriceIds.has(x)),
        };
      }

      console.log(JSON.stringify(tempBody));

      prices[i].count = (
        await es.count({
          index: 'hotels',
          body: tempBody,
        })
      ).count;
    }

    const amenities = [
      {
        id: 26,
        name: 'Free Wifi',
        category: 'Guests Love',
      },
      {
        id: 27,
        name: 'Spa',
        category: 'Guests Love',
      },
      {
        id: 28,
        name: 'Swimming Pool',
        category: 'Guests Love',
      },
      {
        id: 29,
        name: 'Care Taker',
        category: 'General',
      },
      {
        id: 30,
        name: 'Restaurant',
        category: 'General',
      },
      {
        id: 31,
        name: 'Balcony/Terrace',
        category: 'General',
      },
      {
        id: 32,
        name: 'Living Room',
        category: 'General',
      },
      {
        id: 33,
        name: 'Indoor Games',
        category: 'General',
      },
      {
        id: 34,
        name: 'Cafe',
        category: 'General',
      },
      {
        id: 35,
        name: 'Facilities for Guests with Disabilities',
        category: 'General',
      },
      {
        id: 36,
        name: 'Room Service',
        category: 'General',
      },
      {
        id: 37,
        name: 'Outdoor Sports',
        category: 'General',
      },
      {
        id: 38,
        name: 'Bonfire',
        category: 'General',
      },
      {
        id: 39,
        name: 'Bar',
        category: 'General',
      },
      {
        id: 40,
        name: 'Barbeque',
        category: 'General',
      },
      {
        id: 41,
        name: 'Elevator/Lift',
        category: 'General',
      },
      {
        id: 42,
        name: 'Kitchenette',
        category: 'General',
      },
      {
        id: 43,
        name: 'Parking',
        category: 'General',
      },
      {
        id: 44,
        name: 'Bus Station Transfers',
        category: 'Transfers',
      },
      {
        id: 45,
        name: 'Airport Transfers',
        category: 'Transfers',
      },
      {
        id: 46,
        name: 'Railway Station Transfers',
        category: 'Transfers',
      },
    ];

    for (let i = 0; i < amenities.length; i++) {
      const tempBody = body.build();
      const filterAmenityIds = new Set();
      const rooms = await Room.findAll({
        attributes: ['hotelId'],
        include: [
          {
            model: Amenity,
            attributes: ['id'],
            as: 'amenities',
            where: {
              id: amenities[i].id,
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      rooms.forEach((room) => {
        filterAmenityIds.add(room.hotelId.toString());
      });

      if (!priceFiltered && !amenitiesFiltered && !propertyRuleFiltered) {
        if (!tempBody.query) {
          tempBody.query = {
            bool: {
              filter: {
                ids: {
                  values: [...filterAmenityIds],
                },
              },
            },
          };
        } else if (!tempBody.query.bool) {
          tempBody.query.bool = {
            filter: {
              ids: {
                values: [...filterAmenityIds],
              },
            },
          };
        } else if (!tempBody.query.bool.filter) {
          tempBody.query.bool.filter = {
            ids: {
              values: [...filterAmenityIds],
            },
          };
        } else {
          tempBody.query.bool.filter.ids = {
            values: [...filterAmenityIds],
          };
        }
      } else {
        console.log(intersection.size, filterAmenityIds.size);
        tempBody.query.bool.filter.ids = {
          values: [...intersection].filter((x) => filterAmenityIds.has(x)),
        };
      }

      amenities[i].count = (
        await es.count({
          index: 'hotels',
          body: tempBody,
        })
      ).count;
    }

    const rules = [
      {
        id: 6,
        name: 'Unmarried Couples Allowed',
      },
      {
        id: 15,
        name: 'Pets Allowed',
      },
      {
        id: 16,
        name: 'Smoking Allowed',
      },
      {
        id: 17,
        name: 'Alcohol Allowed',
      },
      {
        id: 7,
        name: 'Bachelors Allowed',
      },
    ];

    for (let i = 0; i < rules.length; i++) {
      const tempBody = body.build();
      const filterRuleIds = new Set();
      const hotels = await Hotel.findAll({
        attributes: ['id'],
        include: [
          {
            model: PropertyRule,
            attributes: ['id'],
            as: 'propertyRules',
            where: {
              id: rules[i].id,
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      hotels.forEach((hotel) => {
        filterRuleIds.add(hotel.id.toString());
      });

      if (!priceFiltered && !amenitiesFiltered && !propertyRuleFiltered) {
        if (!tempBody.query) {
          tempBody.query = {
            bool: {
              filter: {
                ids: {
                  values: [...filterRuleIds],
                },
              },
            },
          };
        } else if (!tempBody.query.bool) {
          tempBody.query.bool = {
            filter: {
              ids: {
                values: [...filterRuleIds],
              },
            },
          };
        } else if (!tempBody.query.bool.filter) {
          tempBody.query.bool.filter = {
            ids: {
              values: [...filterRuleIds],
            },
          };
        } else {
          tempBody.query.bool.filter.ids = {
            values: [...filterRuleIds],
          };
        }
      } else {
        console.log(intersection.size, filterRuleIds.size);
        tempBody.query.bool.filter.ids = {
          values: [...intersection].filter((x) => filterRuleIds.has(x)),
        };
      }

      rules[i].count = (
        await es.count({
          index: 'hotels',
          body: body.filter('ids', 'values', [...filterRuleIds]).build(),
        })
      ).count;
    }

    const starCategories = [
      {
        star: 3,
      },
      {
        star: 4,
      },
      {
        star: 5,
      },
    ];

    for (let i = 0; i < starCategories.length; i++) {
      const tempBody = body.build();
      if (!tempBody.query) {
        tempBody.query = {
          bool: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      starCategory: starCategories[i].star,
                    },
                  },
                ],
              },
            },
          },
        };
      } else if (!tempBody.query.bool) {
        tempBody.query.bool = {
          filter: {
            bool: {
              must: [
                {
                  term: {
                    starCategory: starCategories[i].star,
                  },
                },
              ],
            },
          },
        };
      } else if (!tempBody.query.bool.filter) {
        tempBody.query.bool.filter = {
          bool: {
            must: [
              {
                term: {
                  starCategory: starCategories[i].star,
                },
              },
            ],
          },
        };
      } else if (!tempBody.query.bool.filter.bool) {
        tempBody.query.bool.filter.bool = {
          must: [
            {
              term: {
                starCategory: starCategories[i].star,
              },
            },
          ],
        };
      } else if (!tempBody.query.bool.filter.bool.must) {
        tempBody.query.bool.filter.bool.must = [
          {
            term: {
              starCategory: starCategories[i].star,
            },
          },
        ];
      } else {
        tempBody.query.bool.filter.bool.must.push({
          term: {
            starCategory: starCategories[i].star,
          },
        });
      }

      console.log(JSON.stringify(tempBody, null, 2));
      starCategories[i].count = (
        await es.count({
          index: 'hotels',
          body: tempBody,
        })
      ).count;
    }

    const reviews = [
      {
        minRating: 3.0,
      },
      {
        minRating: 4.0,
      },
      {
        minRating: 4.5,
      },
    ];

    for (let i = 0; i < reviews.length; i++) {
      const tempBody = body.build();
      if (!tempBody.query) {
        tempBody.query = {
          bool: {
            filter: {
              bool: {
                must: [
                  {
                    range: {
                      averageRating: {
                        gte: reviews[i].minRating,
                      },
                    },
                  },
                ],
              },
            },
          },
        };
      } else if (!tempBody.query.bool) {
        tempBody.query.bool = {
          filter: {
            bool: {
              must: [
                {
                  range: {
                    averageRating: {
                      gte: reviews[i].minRating,
                    },
                  },
                },
              ],
            },
          },
        };
      } else if (!tempBody.query.bool.filter) {
        tempBody.query.bool.filter = {
          bool: {
            must: [
              {
                range: {
                  averageRating: {
                    gte: reviews[i].minRating,
                  },
                },
              },
            ],
          },
        };
      } else if (!tempBody.query.bool.filter.bool) {
        tempBody.query.bool.filter.bool = {
          must: [
            {
              range: {
                averageRating: {
                  gte: reviews[i].minRating,
                },
              },
            },
          ],
        };
      } else if (!tempBody.query.bool.filter.bool.must) {
        tempBody.query.bool.filter.bool.must = [
          {
            range: {
              averageRating: {
                gte: reviews[i].minRating,
              },
            },
          },
        ];
      } else {
        tempBody.query.bool.filter.bool.must.push({
          range: {
            averageRating: {
              gte: reviews[i].minRating,
            },
          },
        });
      }
      reviews[i].count = (
        await es.count({
          index: 'hotels',
          body: body
            .filter('range', 'avgRating', {
              gte: reviews[i].minRating,
            })
            .build(),
        })
      ).count;
    }

    res.send({ amenities, prices, reviews, rules, starCategories, reviews });

    // console.log(prices);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
