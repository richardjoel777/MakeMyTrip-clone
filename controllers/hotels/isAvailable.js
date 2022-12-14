import getAvailableRooms from "./getAvailableRooms.js";

export default async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  const availableRooms = await getAvailableRooms(roomId, checkIn, checkOut);
  return res.send({ isAvailable: availableRooms.length > 0 });
};
