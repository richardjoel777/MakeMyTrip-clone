import pdfDocument from "pdfkit";
import { db } from "../../models/index.js";

const Booking = db.Booking;
const HotelRoom = db.HotelRoom;
const User = db.User;
const Hotel = db.Hotel;
const Room = db.Room;
const Address = db.Address;
const Profile = db.Profile;

export default async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!booking) {
      return res.status(404).send({ message: "Booking not found." });
    }

    if (booking.status !== "success") {
      return res.status(400).send({ message: "Booking not successful." });
    }

    const room = await HotelRoom.findOne({
      where: {
        id: booking.roomId,
      },
    });

    const roomType = await Room.findOne({
      where: {
        id: room.roomId,
      },
    });

    const hotel = await Hotel.findOne({
      where: {
        id: room.hotelId,
      },
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });

    const user = await User.findOne({
      where: {
        id: booking.userId,
      },
      include: [
        {
          model: Profile,
          as: "profile",
        },
      ],
    });

    const pdfDoc = new pdfDocument();
    pdfDoc.pipe(res);
    pdfDoc
      .fillColor("black")
      .font("Courier-BoldOblique")
      .fontSize(26)
      .text(hotel.name, 120, 16, {
        underline: true,
      })
      .fillColor("black")
      .font("Courier-BoldOblique")
      .fontSize(16)
      .text(
        hotel.address.street +
          ", " +
          hotel.address.city +
          ", " +
          hotel.address.state +
          ", " +
          hotel.address.country,
        120,
        50
      );

    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);

    pdfDoc
      .fontSize(14)
      .text("--------------------------------------------------");

    pdfDoc
      .fontSize(14)
      .text("Name: " + user.profile.firstName + " " + user.profile.lastName);
    pdfDoc
      .fontSize(14)
      .text(
        "Invoice No: " +
          booking.id +
          " | " +
          "Booking Date: " +
          booking.createdAt.toDateString() +
          "\n" +
          roomType.title +
          "\n" +
          "Check In Date: " +
          checkInDate.toDateString() +
          " " +
          hotel.checkInTime +
          "\n" +
          "Check Out Date:" +
          checkOutDate.toDateString() +
          " " +
          hotel.checkOutTime +
          "\n" +
          "Price: " +
          "Rs." +
          booking.totalPrice +
          "\n",
        120,
        105
      );
    pdfDoc.text("-----------------------------");
    pdfDoc.text("Thank You for Booking with us");
    pdfDoc.end();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
