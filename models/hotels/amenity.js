export default (sequelize, { DataTypes }) => {
  const Amenity = sequelize.define(
    "Amenity",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return Amenity;
};
