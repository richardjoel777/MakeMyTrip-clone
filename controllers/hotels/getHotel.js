import room from '../../models/hotels/room.js';
import { db } from '../../models/index.js';

const Hotel = db.Hotel;
const Room = db.Room;
const HotelPicture = db.HotelPicture;
const RoomPicture = db.RoomPicture;
const Tag = db.Tag;
const Amenity = db.Amenity;
const PropertyRule = db.PropertyRule;
const RoomReview = db.RoomReview;
const HotelReview = db.HotelReview;
const Address = db.Address;
const User = db.User;
const Description = db.Description;

export default async (req, res) => {
  try {
    const hotel = await Hotel.findOne({
      where: { id: req.query.hotelId },
      include: [
        {
          model: PropertyRule,
          as: 'propertyRules',
          attributes: {
            exclude: ['tagId'],
          },
          through: {
            attributes: [],
          },
          include: [
            {
              model: Tag,
              as: 'tag',
              attributes: ['id', 'title'],
            },
          ],
        },
        {
          model: HotelPicture,
          as: 'pictures',
          include: [
            {
              model: Tag,
              as: 'tag',
            },
          ],
        },
        {
          model: Address,
          as: 'address',
        },
        {
          model: Description,
          as: 'description',
        },
      ],
    });

    const rooms = await Room.findAll({
      where: { hotelId: req.query.hotelId },
      include: [
        {
          model: RoomPicture,
          as: 'pictures',
          attributes: { exclude: ['tagId', 'roomId'] },
        },
        {
          model: RoomReview,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id'],
              include: [
                {
                  model: db.Profile,
                  as: 'profile',
                  attributes: ['firstName', 'lastName'],
                },
              ],
            },
          ],
          limit: 10,
          order: db.Sequelize.literal('rand()'),
        },
        {
          model: Amenity,
          as: 'amenities',
          through: {
            attributes: [],
          },
          attributes: {
            exclude: ['tagId'],
          },
          include: [
            {
              model: Tag,
              attributes: ['id', 'title'],
              as: 'tag',
            },
          ],
        },
      ],
    });

    hotel.setDataValue(
      'rooms',
      rooms.map((room) => {
        return {
          ...room.dataValues,
          reviews: room.dataValues.reviews.map((review) => {
            const r = review.dataValues;
            r.fistName = r.user.profile.firstName;
            r.lastName = r.user.profile.lastName;
            delete r.user;
            return r;
          }),
        };
      })
    );

    if (!hotel) {
      return res.status(400).send({ message: 'Hotel not found.' });
    }

    res.status(200).send(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
