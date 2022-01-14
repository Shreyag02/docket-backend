"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

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
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: DataTypes.STRING,
      userId: DataTypes.UUID,
      categoryId: DataTypes.STRING,
      description: DataTypes.STRING,
      priority: DataTypes.STRING,
      // createDate: DataTypes.DATE,
      dueDate: DataTypes.DATE,
      addToMyDay: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
      archivedAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: (task, _) => {
          task.id = uuidv4();
        },
      },
      sequelize,
      modelName: "Task",
      underscored: true,
    }
  );
  return Task;
};
