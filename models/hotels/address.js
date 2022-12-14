import es from "../../config/es.js";
export default (sequelize, { DataTypes }) => {
  async function saveDocument(instance) {
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        doc: {
          address: {
            ...instance.dataValues,
          },
        },
      },
    });
  }

  async function deleteDocument(instance) {
    return es.updateByQuery({
      index: "hotels",
      body: {
        query: {
          match: {
            id: instance.dataValues.hotelId,
          },
        },
        script: {
          lang: "painless",
          source: "ctx._source.remove('address')",
        },
      },
    });
  }

  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pinCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      landmark: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      hooks: {
        afterCreate: saveDocument,
        afterUpdate: saveDocument,
        afterDestroy: deleteDocument,
      },
    }
  );
  return Address;
};
