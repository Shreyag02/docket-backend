"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskTag.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      taskId: DataTypes.UUID,
      tagId: DataTypes.UUID,
      archivedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "TaskTag",
      underscored: true,
    }
  );
  return TaskTag;
};
