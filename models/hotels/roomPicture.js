export default (sequelize, { DataTypes }) => {
  const RoomPicture = sequelize.define(
    "RoomPicture",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return RoomPicture;
};
