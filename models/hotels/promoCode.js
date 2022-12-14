export default (Sequelize, { DataTypes }) => {
  const PromoCode = Sequelize.define(
    "PromoCode",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maxDiscount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      minSpend: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return PromoCode;
};
