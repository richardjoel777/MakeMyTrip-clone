import Hotel from "./hotel.js";
import Room from "./room.js";
import PropertyRule from "./propertyRule.js";
import Amenity from "./amenity.js";
import Address from "./address.js";
import Tag from "./tag.js";
import Booking from "./booking.js";
import promoCode from "./promoCode.js";
import hotelRoom from "./hotelRoom.js";
import Description from "./description.js";
import RoomReview from "./roomReview.js";
import HotelReview from "./hotelReview.js";
import hotelPicture from "./hotelPicture.js";
import roomPicture from "./roomPicture.js";
import RoomReviewPicture from "./roomReviewPicture.js";
import hotelReviewPicture from "./hotelReviewPicture.js";

const hotels = {};

hotels.Hotel = Hotel;
hotels.Room = Room;
hotels.PropertyRule = PropertyRule;
hotels.Amenity = Amenity;
hotels.Address = Address;
hotels.Tag = Tag;
hotels.Booking = Booking;
hotels.PromoCode = promoCode;
hotels.HotelRoom = hotelRoom;
hotels.Description = Description;
hotels.RoomReview = RoomReview;
hotels.HotelReview = HotelReview;
hotels.HotelPicture = hotelPicture;
hotels.RoomPicture = roomPicture;
hotels.RoomReviewPicture = RoomReviewPicture;
hotels.HotelReviewPicture = hotelReviewPicture;

export default hotels;
