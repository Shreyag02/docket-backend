"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.hasMany(models.Task, {
        foreignKey: "categoryId",
      });
    }
  }
  Category.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: DataTypes.STRING,
      userId: DataTypes.UUID,
      archivedAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: (category, _) => {
          category.id = uuidv4();
        },
      },
      sequelize,
      modelName: "Category",
      underscored: true,
    }
  );
  return Category;
};
