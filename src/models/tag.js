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
      this.belongsTo(models.User, {
        as: "user",
      });
      this.belongsToMany(models.Task, {
        through: "task_tags",
        foreignKey: "tagId",
        as: "tasks",
      });
    }
  }
  Tag.init(
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
