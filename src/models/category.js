"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      categoryName: DataTypes.STRING,
      userId: DataTypes.STRING,
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
