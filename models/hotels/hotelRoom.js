export default (sequelize, { DataTypes }) => {
  const HotelRoom = sequelize.define(
    "HotelRoom",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastCheckIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastCheckOut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      restoreLastCheckIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      restoreLastCheckOut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return HotelRoom;
};
