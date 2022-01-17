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
      refreshTokenExpiresIn: {
        type: Sequelize.DATE,
        field: "refresh_token_expires_in",
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
        references: {
          // Client hasMany tokens  1:n
          model: "clients",
          key: "client_id",
        },
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        references: {
          // User hasMany tokens  1:n
          model: "users",
          key: "id",
        },
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
