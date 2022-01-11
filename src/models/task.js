"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init(
    {
      taskId: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      taskName: DataTypes.STRING,
      userId: DataTypes.STRING,
      categoryId: DataTypes.STRING,
      description: DataTypes.STRING,
      tagId: DataTypes.STRING,
      priority: DataTypes.STRING,
      createDate: DataTypes.DATE,
      dueDate: DataTypes.DATE,
      addToMyDay: DataTypes.BOOLEAN,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Task",
      underscored: true,
    }
  );
  return Task;
};
