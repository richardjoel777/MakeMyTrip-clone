export default (sequelize, { DataTypes }) => {
  const PropertyRule = sequelize.define(
    "PropertyRule",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return PropertyRule;
};
