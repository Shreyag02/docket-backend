"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Subtask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Task, {
        as: "task",
      });
    }
  }
  Subtask.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: DataTypes.STRING,
      taskId: DataTypes.UUID,
      status: DataTypes.ENUM("pending", "completed"),
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
      archivedAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: (subtask, _) => {
          subtask.id = uuidv4();
        },
      },
      sequelize,
      modelName: "Subtask",
      underscored: true,
    }
  );
  return Subtask;
};
