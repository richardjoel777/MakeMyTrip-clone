import es from "../../config/es.js";

export default (sequelize, { DataTypes }) => {
  async function saveDocument(instance) {
    return es.create({
      index: "hotels",
      id: instance.dataValues.id,
      body: {
        name: instance.dataValues.name,
        bio: instance.dataValues.bio,
        starCategory: instance.dataValues.starCategory,
        checkInTime: instance.dataValues.checkInTime,
        checkOutTime: instance.dataValues.checkOutTime,
        totalRating: instance.dataValues.totalRating,
        totalReviews: instance.dataValues.totalReviews,
        avgRating: instance.dataValues.avgRating,
      },
    });
  }

  async function deleteDocument(instance) {
    return es.delete({
      index: "hotels",
      id: instance.dataValues.id,
    });
  }

  const Hotel = sequelize.define(
    "Hotel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      starCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [[1, 2, 3, 4, 5]],
            msg: "Star category must be between 1 and 5",
          },
        },
      },
      totalReviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalRating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      avgRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      checkInTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      checkOutTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      hooks: {
        afterCreate: saveDocument,
        // afterUpdate: saveDocument,
        afterDestroy: deleteDocument,
      },
    }
  );
  return Hotel;
};
