"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PromoCodes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maxDiscount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      minSpend: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PromoCodes");
  },
};
