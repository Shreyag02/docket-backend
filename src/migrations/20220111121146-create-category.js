"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("categories", {
      categoryId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        field: "category_id",
      },
      categoryName: {
        type: Sequelize.STRING,
        field: "category_name",
      },
      userId: {
        type: Sequelize.STRING,
        field: "user_Id",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at",
      },
      archivedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "archived_at",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("categories");
  },
};
