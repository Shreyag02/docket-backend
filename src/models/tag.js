"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tag.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      tagName: DataTypes.STRING,
      userId: DataTypes.STRING,
      archivedAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: (tag, _) => {
          tag.id = uuidv4();
        },
      },
      sequelize,
      modelName: "Tag",
      underscored: true,
    }
  );
  return Tag;
};
