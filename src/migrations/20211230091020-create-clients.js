"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("clients", {
      clientId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        field: "client_id",
      },
      clientSecret: {
        type: Sequelize.STRING,
        field: "client_secret",
      },
      clientName: {
        type: Sequelize.STRING,
        field: "client_name",
      },
      dataUris: {
        type: Sequelize.JSON,
        field: "data_uris",
        allowNull: true,
      },
      grants: {
        type: Sequelize.JSON,
        allowNull: true,
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
    await queryInterface.dropTable("clients");
  },
};
