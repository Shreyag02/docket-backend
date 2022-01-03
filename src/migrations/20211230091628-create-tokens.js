"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tokens", {
      accessToken: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        field: "access_token",
      },
      expiresIn: {
        type: Sequelize.DATE,
        field: "expires_in",
      },
      refreshToken: {
        type: Sequelize.STRING,
        field: "refresh_token",
      },
      scope: {
        type: Sequelize.STRING,
      },
      tokenType: {
        type: Sequelize.STRING,
        field: "token_type",
      },
      clientId: {
        type: Sequelize.STRING,
        field: "client_id",
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
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
    await queryInterface.dropTable("tokens");
  },
};
