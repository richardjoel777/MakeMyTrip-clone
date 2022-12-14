export default (sequelize, { DataTypes }) => {
  const HotelReviewPicture = sequelize.define(
    "HotelReviewPicture",
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
  return HotelReviewPicture;
};
