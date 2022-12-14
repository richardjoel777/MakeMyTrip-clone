export default (sequelize, { DataTypes }) => {
  const RoomReview = sequelize.define("RoomReview", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[1, 2, 3, 4, 5]],
          msg: "Star category must be between 1 and 5",
        },
      },
    },
  });
  return RoomReview;
};
