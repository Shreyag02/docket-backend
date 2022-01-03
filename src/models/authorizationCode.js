"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuthorizationCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AuthorizationCode.init(
    {
      authorizationCode: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      expiresAt: DataTypes.DATE,
      redirectedUri: DataTypes.STRING,
      clientId: DataTypes.STRING,
      userId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "AuthorizationCode",
      underscored: true,
    }
  );
  return AuthorizationCode;
};
