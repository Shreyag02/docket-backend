"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("authorization_codes", {
      authorizationCode: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        field: "authorization_code",
      },
      expiresAt: {
        type: Sequelize.DATE,
        field: "expires_at",
      },
      redirectedUri: {
        type: Sequelize.STRING,
        field: "redirected_uri",
      },
      clientId: {
        type: Sequelize.STRING,
        field: "client_id",
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        references: {
          // User hasMany aiuthorization codes  1:n
          model: "User",
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
    await queryInterface.dropTable("authorization_codes");
  },
};
