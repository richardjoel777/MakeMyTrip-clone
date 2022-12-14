"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HotelRooms", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_no: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastCheckIn: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastCheckOut: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      restoreLastCheckIn: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      restoreLastCheckOut: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      hotelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("HotelRooms");
  },
};
