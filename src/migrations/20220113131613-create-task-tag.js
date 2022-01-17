"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("task_tags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      taskId: {
        type: Sequelize.UUID,
        field: "task_id",
        // references: {
        //   // Task hasMany Tags n:n
        //   model: "Task",
        //   key: "id",
        // },
      },
      tagId: {
        type: Sequelize.UUID,
        field: "tag_id",
        // references: {
        //   // Tag hasMany Tasks n:n
        //   model: "Tag",
        //   key: "id",
        // },
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
    await queryInterface.dropTable("task_tags");
  },
};
