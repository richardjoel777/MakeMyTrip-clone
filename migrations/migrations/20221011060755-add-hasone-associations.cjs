"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("Addresses", "hotelId", {
        type: Sequelize.INTEGER,
        references: {
          model: "Hotels",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
      .then(() => {
        return queryInterface.addColumn("Descriptions", "hotelId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Hotels",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Profiles", "userId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Reviews", "userId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Rooms", "hotelId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Hotels",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Bookings", "userId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Bookings", "roomId", {
          type: Sequelize.INTEGER,
          references: {
            model: "HotelRooms",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Amenities", "tagId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Tags",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      })
      .then(() => {
        return queryInterface.addColumn("PropertyRules", "tagId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Tags",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Pictures", "tagId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Tags",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Addresses", "hotelId");
    await queryInterface.removeColumn("Descriptions", "hotelId");
    await queryInterface.removeColumn("Profiles", "userId");
    await queryInterface.removeColumn("Reviews", "userId");
    await queryInterface.removeColumn("Rooms", "hotelId");
    await queryInterface.removeColumn("Bookings", "userId");
    await queryInterface.removeColumn("Bookings", "roomId");
    await queryInterface.removeColumn("Amenities", "tagId");
    await queryInterface.removeColumn("PropertyRules", "tagId");
    await queryInterface.removeColumn("Pictures", "tagId");
  },
};
