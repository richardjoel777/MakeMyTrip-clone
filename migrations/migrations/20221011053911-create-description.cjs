"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Descriptions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      foodAndDining: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      locationAndSurrondings: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      propertyHighlights: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      roomDetailsAndAmenities: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      activitiesAndAttractions: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      howToReach: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Descriptions");
  },
};
