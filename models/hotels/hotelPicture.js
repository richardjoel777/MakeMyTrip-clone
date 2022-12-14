import es from "../../config/es.js";

export default (sequelize, { DataTypes }) => {
  async function saveDocument(instance) {
    // console.log("saveDocument", instance.dataValues);
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "if (!ctx._source.containsKey('pictures')) ctx._source.pictures= new ArrayList(); ctx._source.pictures.add(params.picture);",
          lang: "painless",
          params: {
            picture: {
              ...instance.dataValues,
            },
          },
        },
      },
    });
  }

  async function updateDocument(instance) {
    // console.log("updateDocument", instance.dataValues);
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "for(int i=0;i<ctx._source.pictures.size();i++){if(ctx._source.pictures[i].id.equals(params.picture.id)){ctx._source.pictures[i]=params.picture}}",
          lang: "painless",
          params: {
            picture: {
              ...instance.dataValues,
            },
          },
        },
      },
    });
  }

  async function deleteDocument(instance) {
    // console.log("deleteDocument", instance.dataValues);
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          lang: "painless",
          source:
            "for (int i = 0; i < ctx._source.pictures.length; ++i) {if (ctx._source.pictures[i]['id'] == params['id']) {ctx._source.pictures.remove(i);}}",
          params: { id: instance.dataValues.id },
        },
      },
    });
  }

  const HotelPicture = sequelize.define(
    "HotelPicture",
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
      hooks: {
        afterCreate: saveDocument,
        afterUpdate: updateDocument,
        afterDestroy: deleteDocument,
      },
    }
  );
  return HotelPicture;
};
