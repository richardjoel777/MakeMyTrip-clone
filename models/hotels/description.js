import es from "../../config/es.js";

export default (sequelize, { DataTypes }) => {
  async function saveDocument(instance) {
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        doc: {
          description: {
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
          source: "ctx._source.remove('description')",
        },
      },
    });
  }

  const Description = sequelize.define(
    "Description",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      foodAndDining: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      locationAndSurrondings: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      propertyHighlights: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      roomDetailsAndAmenities: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      activitiesAndAttractions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      howToReach: {
        type: DataTypes.TEXT,
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
  return Description;
};
