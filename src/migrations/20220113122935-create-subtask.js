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
        // references: {
        //   // task hasMany subtasks  1:n
        //   model: "Task",
        //   key: "id",
        // },
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
    await queryInterface.dropTable("subtasks");
  },
};
