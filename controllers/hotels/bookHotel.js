import stripeObj from "stripe";
import { db } from "../../models/index.js";
import getAvailableRooms from "./getAvailableRooms.js";
import paymentConfig from "../../config/payment.js";
import hotelConfig from "../../config/hotel.js";

const Room = db.Room;
const Booking = db.Booking;

const stripe = stripeObj(paymentConfig.stripeSecretKey);

const Op = db.Sequelize.Op;

export default async (req, res) => {
  try {
    const room = await Room.findOne({
      where: { id: req.body.roomId },
    });

    if (!room) {
      return res.status(400).send({ message: "Room not found." });
    }

    if (
      room.adultsCount < req.body.adultsCount ||
      room.childrenCount < req.body.childrenCount
    ) {
      return res
        .status(400)
        .send({ message: "Room is not suitable for this number of people." });
    }

    const checkInDate = new Date(req.body.checkInDate);
    const checkOutDate = new Date(req.body.checkOutDate);

    if (checkInDate > checkOutDate) {
      return res
        .status(400)
        .send({ message: "Check in date must be before check out date." });
    }

    const availableRooms = await getAvailableRooms(
      req.body.roomId,
      checkInDate,
      checkOutDate
    );

    if (availableRooms.length === 0) {
      return res
        .status(400)
        .send({ message: "Room is not available for this dates." });
    }

    const roomToBook = availableRooms[0];

    roomToBook.lastCheckIn = checkInDate;
    roomToBook.lastCheckOut = checkOutDate;

    var totalDays =
      +(
        Math.round(checkOutDate.getTime() - checkInDate.getTime()) /
        (1000 * 60 * 60 * 24)
      ).toFixed(0) + 1;

    console.log(totalDays);

    let totalPrice = room.price * totalDays;

    console.log("Price before discount", totalPrice, "Total days", totalDays);
    let promocodes = [];

    if (req.body.promocodes) {
      console.log(req.body.promocodes);
      promocodes = await db.PromoCode.findAll({
        where: {
          code: {
            [Op.in]: req.body.promocodes,
          },
        },
        include: [
          {
            model: db.Hotel,
            as: "hotels",
            where: {
              id: room.hotelId,
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      let totalDiscount = 0;

      if (promocodes.length > 0) {
        console.log(promocodes.length);
        for (let i = 0; i < promocodes.length; i++) {
          console.log(promocodes[i]);
          if (promocodes[i].minSpend <= totalPrice) {
            console.log("APPLIED ", promocodes[i].code);
            const discount = (totalPrice * promocodes[i].discount) / 100;
            console.log("Discount: " + discount);
            totalPrice -=
              discount > promocodes[i].maxDiscount
                ? promocodes[i].maxDiscount
                : discount;
            totalDiscount +=
              discount > promocodes[i].maxDiscount
                ? promocodes[i].maxDiscount
                : discount;
          } else {
            promocodes.splice(i, 1);
          }
        }
      }
      console.log("Total Discount", totalDiscount);
    }

    totalPrice += totalPrice * hotelConfig.taxRate;

    console.log("Total Price", totalPrice);

    const booking = await Booking.create({
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adultsCount: req.body.adultsCount,
      childrenCount: req.body.childrenCount,
      totalPrice: totalPrice,
      status: "pending",
      userId: req.userId,
      roomId: roomToBook.id,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        bookingId: booking.id,
      },
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: Math.floor(totalPrice) * 100,
            product_data: {
              name: room.title,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payments/success/{CHECKOUT_SESSION_ID}?bookingId=${booking.id}`,
      cancel_url: `http://localhost:3000/payments/cancel/{CHECKOUT_SESSION_ID}?bookingId=${booking.id}`,
    });

    if (promocodes.length > 0) {
      await booking.addPromoCodes(promocodes);
    }

    res.send({ url: session.url });
    // res.redirect(303, session.url);
    // res.status(200).send(booking);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
