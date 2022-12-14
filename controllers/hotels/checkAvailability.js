import getAvailableRooms from "./getAvailableRooms.js";

export default async (req, res) => {
  const availableRooms = await getAvailableRooms(
    req.body.roomId,
    req.body.checkIn,
    req.body.checkOut
  );

  if (availableRooms && availableRooms.length > 0) {
    return res.status(200).send({
      available: true,
    });
  }

  return res.status(200).json({
    available: false,
  });
};
