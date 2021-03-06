"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.Token, {
        foreignKey: "userId",
        as: "tokens",
      });
      this.hasMany(models.Tag, {
        foreignKey: "userId",
        as: "tags",
      });
      this.hasMany(models.Task, {
        foreignKey: "userId",
        as: "tasks",
      });
      this.hasMany(models.Category, {
        foreignKey: "userId",
        as: "categories",
      });
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      archivedAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: (user, _) => {
          user.id = uuidv4();
        },
      },
      sequelize,
      modelName: "User",
      underscored: true,
    }
  );
  return User;
};
