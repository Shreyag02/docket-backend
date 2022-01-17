"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tasks", {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        references: {
          // User hasMany tasks 1:n
          model: "users",
          key: "id",
        },
      },
      categoryId: {
        type: Sequelize.STRING,
        field: "category_id",
        references: {
          // Category hasMany tasks  1:n
          model: "categories",
          key: "id",
        },
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      priority: {
        allowNull: true,
        type: Sequelize.ENUM("urgent", "medium", "low"),
      },
      dueDate: {
        type: Sequelize.DATE,
        field: "due_date",
      },
      addToMyDay: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "add_to_my_day",
      },
      status: {
        type: Sequelize.ENUM("pending", "completed"),
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
    await queryInterface.dropTable("tasks");
  },
};
