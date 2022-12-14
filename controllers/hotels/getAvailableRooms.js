import { db } from "../../models/index.js";

const HotelRoom = db.HotelRoom;

const Op = db.Sequelize.Op;

export default async (roomId, checkIn, checkOut) => {
  // console.log(checkIn, checkOut, roomId);
  const availableRooms = await HotelRoom.findAll({
    where: {
      roomId: roomId,
      [Op.or]: {
        lastCheckIn: {
          [Op.gte]: checkOut,
        },
        lastCheckOut: {
          [Op.lte]: checkIn,
        },
      },
    },
  });

  // console.log("Available rooms : ", availableRooms);

  return availableRooms;
};
