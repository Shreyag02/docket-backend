"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      // this.belongsTo(models.Client);
    }
  }
  Token.init(
    {
      accessToken: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      expiresIn: DataTypes.DATE,
      refreshToken: DataTypes.STRING,
      refreshTokenExpiresIn: DataTypes.DATE,
      scope: DataTypes.STRING,
      tokenType: DataTypes.STRING,
      clientId: DataTypes.STRING,
      userId: DataTypes.UUID,
      archivedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Token",
      underscored: true,
    }
  );
  return Token;
};
