import { db } from "../../models/index.js";

const Room = db.Room;
const Booking = db.Booking;
const HotelRoom = db.HotelRoom;

const Op = db.Sequelize.Op;

const mapBooking = async (booking) => {
  const bookingData = {};
  for (let key in booking.dataValues) {
    // console.log(key);
    bookingData[key] = booking.dataValues[key];
  }

  const room = await Room.findOne({
    where: {
      id: booking.roomId,
    },
  });

  bookingData.room = room;

  return bookingData;
};

export default async (req, res) => {
  try {
    console.log(req.userId);
    const bookings = await Booking.findAll({
      where: {
        userId: req.userId,
        status: {
          [Op.ne]: "failure",
        },
      },
      include: [
        {
          model: HotelRoom,
          as: "room",
        },
      ],
    });

    const bookingsData = [];

    for (let i = 0; i < bookings.length; i++) {
      const booking = await mapBooking(bookings[i]);
      bookingsData.push(booking);
    }

    res.status(200).send(bookingsData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
