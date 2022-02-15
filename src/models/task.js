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
      this.belongsTo(models.User, {
        as: "user",
      });
      this.belongsTo(models.Category, {
        as: "category",
      });
      this.hasMany(models.Subtask, {
        foreignKey: "taskId",
        as: "subtasks",
      });
      this.belongsToMany(models.Tag, {
        through: "task_tags",
        foreignKey: "taskId",
        as: "tags",
      });
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
      categoryId: DataTypes.UUID,
      categoryName: DataTypes.STRING,
      description: DataTypes.STRING,
      priority: DataTypes.ENUM("urgent", "medium", "low"),
      dueDate: DataTypes.DATE,
      reminderDate: DataTypes.DATE,
      repeat: DataTypes.ENUM("daily", "monthly", "weekly", "yearly"),
      addToMyDay: DataTypes.DATE,
      status: DataTypes.ENUM("pending", "completed"),
      totalTime: DataTypes.INTEGER,
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
