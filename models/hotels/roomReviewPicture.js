export default (sequelize, { DataTypes }) => {
  const RoomReviewPicture = sequelize.define(
    "RoomReviewPicture",
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
  return RoomReviewPicture;
};
