"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Client.init(
    {
      clientId: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      clientSecret: DataTypes.STRING,
      clientName: DataTypes.STRING,
      dataUris: DataTypes.JSON,
      grants: DataTypes.JSON,
      archivedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Client",
      underscored: true,
    }
  );
  return Client;
};
