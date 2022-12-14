import dbConfig from "../config/database.js";
import Sequelize from "sequelize";
import users from "./users/index.js";
import hotels from "./hotels/index.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});


await sequelize.sync({
    // force: true,
    // alter: true,
});
console.log("Database connected");

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = users.User(sequelize, Sequelize);
db.Profile = users.Profile(sequelize, Sequelize);
db.Otp = users.Otp(sequelize, Sequelize);

db.User.hasOne(db.Profile, {
  foreignKey: "userId",
  as: "profile",
});

db.Profile.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

db.Hotel = hotels.Hotel(sequelize, Sequelize);
db.Room = hotels.Room(sequelize, Sequelize);
db.PropertyRule = hotels.PropertyRule(sequelize, Sequelize);
db.Amenity = hotels.Amenity(sequelize, Sequelize);
db.Address = hotels.Address(sequelize, Sequelize);
db.Tag = hotels.Tag(sequelize, Sequelize);
db.Booking = hotels.Booking(sequelize, Sequelize);
db.PromoCode = hotels.PromoCode(sequelize, Sequelize);
db.HotelRoom = hotels.HotelRoom(sequelize, Sequelize);
db.Description = hotels.Description(sequelize, Sequelize);
db.HotelPicture = hotels.HotelPicture(sequelize, Sequelize);
db.RoomPicture = hotels.RoomPicture(sequelize, Sequelize);
db.RoomReview = hotels.RoomReview(sequelize, Sequelize);
db.HotelReview = hotels.HotelReview(sequelize, Sequelize);
db.RoomReviewPicture = hotels.RoomReviewPicture(sequelize, Sequelize);
db.HotelReviewPicture = hotels.HotelReviewPicture(sequelize, Sequelize);

db.Hotel.hasOne(
  db.Address,
  {
    foreignKey: "hotelId",
    as: "address",
  },
  {
    onDelete: "cascade",
  }
);

db.Address.belongsTo(
  db.Hotel,
  {
    foreignKey: "hotelId",
    as: "hotel",
  },
  {
    onDelete: "cascade",
  }
);

db.Hotel.hasOne(
  db.Description,
  {
    foreignKey: "hotelId",
    as: "description",
  },
  {
    onDelete: "cascade",
  }
);

db.Description.belongsTo(
  db.Hotel,
  {
    foreignKey: "hotelId",
    as: "hotel",
  },
  {
    onDelete: "cascade",
  }
);

db.Hotel.hasMany(
  db.Room,
  {
    foreignKey: "hotelId",
    as: "rooms",
  },
  {
    onDelete: "cascade",
  }
);

db.Room.belongsTo(
  db.Hotel,
  {
    foreignKey: "hotelId",
    as: "hotel",
  },
  {
    onDelete: "cascade",
  }
);

db.Hotel.hasMany(
  db.HotelReview,
  {
    foreignKey: "hotelId",
    as: "reviews",
  },
  {
    onDelete: "cascade",
  }
);

db.HotelReview.belongsTo(
  db.Hotel,
  {
    foreignKey: "hotelId",
    as: "hotel",
  },
  {
    onDelete: "cascade",
  }
);

db.Hotel.hasMany(
  db.HotelPicture,
  {
    foreignKey: "hotelId",
    as: "pictures",
  },
  {
    onDelete: "cascade",
  }
);

db.HotelPicture.belongsTo(
  db.Hotel,
  {
    foreignKey: "hotelId",
    as: "hotel",
  },
  {
    onDelete: "cascade",
  }
);

db.Room.hasMany(
  db.RoomReview,
  {
    foreignKey: "roomId",
    as: "reviews",
  },
  {
    onDelete: "cascade",
  }
);

db.RoomReview.belongsTo(
  db.Room,
  {
    foreignKey: "roomId",
    as: "room",
  },
  {
    onDelete: "cascade",
  }
);

db.Room.hasMany(
  db.RoomPicture,
  {
    foreignKey: "roomId",
    as: "pictures",
  },
  {
    onDelete: "cascade",
  }
);

db.RoomPicture.belongsTo(
  db.Room,
  {
    foreignKey: "roomId",
    as: "room",
  },
  {
    onDelete: "cascade",
  }
);

db.Amenity.belongsTo(
  db.Tag,
  {
    foreignKey: "tagId",
    as: "tag",
  },
  {
    onDelete: "cascade",
  }
);
db.Tag.hasMany(
  db.Amenity,
  {
    foreignKey: "tagId",
    as: "amenities",
  },
  {
    onDelete: "cascade",
  }
);

db.PropertyRule.belongsTo(
  db.Tag,
  {
    foreignKey: "tagId",
    as: "tag",
  },
  {
    onDelete: "cascade",
  }
);

db.Tag.hasMany(
  db.PropertyRule,
  {
    foreignKey: "tagId",
    as: "propertyRules",
  },
  {
    onDelete: "cascade",
  }
);

db.RoomPicture.belongsTo(
  db.Tag,
  {
    foreignKey: "tagId",
    as: "tag",
  },
  {
    onDelete: "SET NULL",
  }
);

db.Tag.hasMany(
  db.RoomPicture,
  {
    foreignKey: "tagId",
    as: "roomPictures",
  },
  {
    onDelete: "SET NULL",
  }
);

db.HotelPicture.belongsTo(
  db.Tag,
  {
    foreignKey: "tagId",
    as: "tag",
  },
  {
    onDelete: "SET NULL",
  }
);

db.Tag.hasMany(
  db.HotelPicture,
  {
    foreignKey: "tagId",
    as: "hotelPictures",
  },
  {
    onDelete: "SET NULL",
  }
);

db.Room.belongsToMany(
  db.Amenity,
  {
    through: "room_amenities",
    timestamps: false,
    as: "amenities",
    foreignKey: "roomId",
  },
  {
    onDelete: "cascade",
  }
);

db.Amenity.belongsToMany(
  db.Room,
  {
    through: "room_amenities",
    timestamps: false,
    as: "rooms",
    foreignKey: "amenityId",
  },
  {
    onDelete: "cascade",
  }
);

db.HotelReview.belongsTo(
  db.Booking,
  {
    foreignKey: "bookingId",
    as: "booking",
  },
  {
    onDelete: "cascade",
  }
);

db.Booking.hasOne(
  db.HotelReview,
  {
    foreignKey: "bookingId",
    as: "hotelReview",
  },
  {
    onDelete: "cascade",
  }
);

db.RoomReview.belongsTo(
  db.Booking,
  {
    foreignKey: "bookingId",
    as: "booking",
  },
  {
    onDelete: "cascade",
  }
);

db.Booking.hasOne(
  db.RoomReview,
  {
    foreignKey: "bookingId",
    as: "roomReview",
  },
  {
    onDelete: "cascade",
  }
);

db.HotelReview.belongsTo(
  db.User,
  {
    foreignKey: "userId",
    as: "user",
  },
  {
    onDelete: "cascade",
  }
);

db.User.hasMany(
  db.HotelReview,
  {
    foreignKey: "userId",
    as: "hotelReviews",
  },
  {
    onDelete: "cascade",
  }
);

db.RoomReview.hasMany(
  db.RoomReviewPicture,
  {
    foreignKey: "reviewId",
    as: "pictures",
  },
  {
    onDelete: "cascade",
  }
);

db.RoomReviewPicture.belongsTo(
  db.RoomReview,
  {
    foreignKey: "reviewId",
    as: "review",
  },
  {
    onDelete: "cascade",
  }
);

db.HotelReview.hasMany(
  db.HotelReviewPicture,
  {
    foreignKey: "reviewId",
    as: "pictures",
  },
  {
    onDelete: "cascade",
  }
);

db.HotelReviewPicture.belongsTo(
  db.HotelReview,
  {
    foreignKey: "reviewId",
    as: "review",
  },
  {
    onDelete: "cascade",
  }
);

db.RoomReview.belongsTo(
  db.User,
  {
    foreignKey: "userId",
    as: "user",
  },
  {
    onDelete: "cascade",
  }
);

db.User.hasMany(
  db.RoomReview,
  {
    foreignKey: "userId",
    as: "roomReviews",
  },
  {
    onDelete: "cascade",
  }
);

db.Booking.belongsTo(
  db.User,
  {
    foreignKey: "userId",
    as: "user",
  },
  {
    onDelete: "cascade",
  }
);

db.User.hasMany(
  db.Booking,
  {
    foreignKey: "userId",
    as: "bookings",
  },
  {
    onDelete: "cascade",
  }
);

db.Booking.belongsTo(
  db.HotelRoom,
  {
    foreignKey: "roomId",
    as: "room",
  },
  {
    onDelete: "cascade",
  }
);

db.HotelRoom.hasMany(
  db.Booking,
  {
    foreignKey: "roomId",
    as: "bookings",
  },
  {
    onDelete: "cascade",
  }
);

db.Hotel.belongsToMany(
  db.PromoCode,
  {
    through: "hotel_promo_codes",
    timestamps: false,
    as: "promoCodes",
    foreignKey: "hotelId",
  },
  {
    onDelete: "cascade",
  }
);

db.PromoCode.belongsToMany(
  db.Hotel,
  {
    through: "hotel_promo_codes",
    timestamps: false,
    as: "hotels",
    foreignKey: "promoCodeId",
  },
  {
    onDelete: "cascade",
  }
);

db.Hotel.belongsToMany(
  db.PropertyRule,
  {
    through: "hotel_property_rules",
    timestamps: false,
    as: "propertyRules",
    foreignKey: "hotelId",
  },
  {
    onDelete: "cascade",
  }
);

db.PropertyRule.belongsToMany(db.Hotel, {
  through: "hotel_property_rules",
  timestamps: false,
  as: "hotels",
  foreignKey: "propertyRuleId",
});

db.Booking.belongsToMany(
  db.PromoCode,
  {
    through: "booking_promo_codes",
    timestamps: false,
    as: "promoCodes",
    foreignKey: "bookingId",
  },
  {
    onDelete: "CASCADE",
  }
);

db.PromoCode.belongsToMany(db.Booking, {
  through: "booking_promo_codes",
  timestamps: false,
  as: "bookings",
  foreignKey: "promoCodeId",
});

export { db };
