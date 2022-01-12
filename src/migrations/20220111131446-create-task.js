"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tasks", {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      taskName: {
        type: Sequelize.STRING,
        field: "task_name",
      },
      userId: {
        type: Sequelize.STRING,
        field: "user_id",
      },
      categoryId: {
        type: Sequelize.STRING,
        field: "category_id",
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      tagId: {
        allowNull: true,
        type: Sequelize.JSON,
        field: "tag_id",
      },
      priority: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createDate: {
        type: Sequelize.DATE,
        field: "create_date",
      },
      dueDate: {
        type: Sequelize.DATE,
        field: "due_date",
      },
      addToMyDay: {
        type: Sequelize.BOOLEAN,
        field: "add_to_my_day",
      },
      status: {
        type: Sequelize.STRING,
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
