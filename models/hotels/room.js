import es from "../../config/es.js";

export default (sequelize, { DataTypes }) => {
  async function saveDocument(instance) {
    // console.log("here before error");
    await es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "if (!ctx._source.containsKey('rooms')) ctx._source.rooms= new ArrayList(); ctx._source.rooms.add(params.room);",
          lang: "painless",
          params: {
            room: {
              ...instance.dataValues,
            },
          },
        },
      },
    });
  }

  async function updateDocument(instance) {
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          source:
            "for(int i=0;i<ctx._source.rooms.size();i++){if(ctx._source.rooms[i].id.equals(params.room.id)){ctx._source.rooms[i]=params.room}}",
          lang: "painless",
          params: {
            room: {
              ...instance.dataValues,
            },
          },
        },
      },
    });
  }

  async function deleteDocument(instance) {
    return es.update({
      index: "hotels",
      id: instance.dataValues.hotelId,
      body: {
        script: {
          lang: "painless",
          source:
            "for (int i = 0; i < ctx._source.rooms.length; ++i) {if (ctx._source.rooms[i]['id'] == params['id']) {ctx._source.rooms.remove(i);}}",
          params: { id: instance.dataValues.id },
        },
      },
    });
  }

  const Room = sequelize.define(
    "Room",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      isRefundable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      cancellationHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      children: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      area: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      bedType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      freeBreakfast: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      view: {
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
  return Room;
};
