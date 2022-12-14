import stripeObj from "stripe";
import { db } from "../../models/index.js";
import paymentConfig from "../../config/payment.js";

const Booking = db.Booking;
const HotelRoom = db.HotelRoom;

const stripe = stripeObj(paymentConfig.stripeSecretKey);


const bookingSuccess = async (bookingId, session) => {

    const booking = await Booking.findOne({
        where: {
        id: bookingId,
        },
    });

    const room = await HotelRoom.findOne({
        where: {
        id: booking.roomId,
        },
    });
    
    const paymentId = session.payment_intent;

    const payment = await stripe.paymentIntents.retrieve(paymentId);
    
    if (payment.status === "succeeded") {

        room.restoreLastCheckIn = room.lastCheckIn;
        room.restoreLastCheckOut = room.lastCheckOut;

        room.lastCheckIn = booking.checkInDate;
        room.lastCheckOut = booking.checkOutDate;

        await room.save();
    

        //   console.log(payment);

        const charges = payment.charges.data;

        const charge = charges[0];

        booking.transactionId = charge.id;
        booking.status = "success";
        await booking.save();
    }
    else {
        booking.status = "failure";
        await booking.save();
    }
};

export default async (req, res) => {
  const sig = req.headers["stripe-signature"];

    let event;
    
    // console.log("Inside webHook");

    // console.log("sig", sig)

    // console.log("req.body", req.body);
    // console.log("req.rawBody", req.rawBody);

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, paymentConfig.stripeWebHookSecret);
  } catch (err) {
    console.log("Error inside webhook", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if(event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    await bookingSuccess(bookingId, session);
  }
  res.send({event});
}