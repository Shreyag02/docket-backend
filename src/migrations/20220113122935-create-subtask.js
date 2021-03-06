"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("subtasks", {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      taskId: {
        type: Sequelize.UUID,
        field: "task_id",
        references: {
          // task hasMany subtasks  1:n
          model: "tasks",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("pending", "completed"),
      },
      startTime: {
        type: Sequelize.TIME,
        field: "start_time",
      },
      endTime: {
        type: Sequelize.TIME,
        field: "end_time",
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
    await queryInterface.dropTable("subtasks");
  },
};
