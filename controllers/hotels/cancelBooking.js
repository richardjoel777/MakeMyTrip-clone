import stripeObj from "stripe";
import { db } from "../../models/index.js";
import paymentConfig from "../../config/payment.js";

const Room = db.Room;
const Booking = db.Booking;
const HotelRoom = db.HotelRoom;

const stripe = stripeObj(paymentConfig.stripeSecretKey);

export default async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: HotelRoom,
          as: "room",
        },
      ],
    });

    // console.log(booking);

    // console.log(booking.checkInDate, new Date());

    if (
      booking.status != "success" ||
      new Date(booking.checkInDate) < new Date()
    ) {
      return res.status(400).send("Booking not applicable for cancellation");
    }

    const room = await Room.findOne({
      where: {
        id: booking.room.roomId,
      },
    });

    const checkIn = booking.checkInDate;

    console.log("Check in", new Date(checkIn));

    const cancellationDeadline = new Date(
      checkIn.setHours(checkIn.getHours() - room.cancellationHours)
    );

    let refundAmount = 0;

    console.log("Cancellation Deadline", cancellationDeadline);

    if (room.isRefundable && new Date() <= cancellationDeadline) {
      refundAmount = booking.totalPrice;
    }

    const refund = await stripe.refunds.create({
      charge: booking.transactionId,
    });

    booking.transactionId = refund.id;

    booking.status = "cancel";

    booking.room.lastCheckIn = booking.room.restoreLastCheckIn;
    booking.room.lastCheckOut = booking.room.restoreLastCheckOut;

    await booking.room.save();

    await booking.save();

    res.send({ message: "Booking Cancelled Successfully", refundAmount });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
