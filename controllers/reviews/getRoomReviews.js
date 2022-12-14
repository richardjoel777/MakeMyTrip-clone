import { db } from '../../models/index.js';

const Room = db.Room;
const Picture = db.Picture;
const Tag = db.Tag;
const Review = db.Review;
const User = db.User;
const Profile = db.Profile;

export default async (req, res) => {
  try {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id'],
          as: 'user',
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        },
        {
          model: Room,
          as: 'rooms',
          where: { id: req.query.roomId },
          through: {
            attributes: [],
          },
        },
        {
          model: Picture,
          as: 'pictures',
          through: {
            attributes: [],
          },
          include: [
            {
              model: Tag,
              as: 'tag',
            },
          ],
        },
      ],
      offset,
      limit: 20,
    });
    res.status(200).send(
      reviews.map((review) => {
        return {
          id: review.id,
          title: review.title,
          description: review.description,
          rating: review.rating,
          createdAt: review.createdAt,
          firstName: review.user.profile.firstName,
          lastName: review.user.profile.lastName,
          pictures: review.pictures,
        };
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
