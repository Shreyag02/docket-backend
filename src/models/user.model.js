"use strict";
const { Model } = require("sequelize");
// const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        validate: {
          notNull: true,
        },
      },

      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      // hooks: {
      //   beforeCreate: (user, _) => {
      //     console.log(user.id);
      //     user.id = uuidv4();
      //     console.log("after", user.id);
      //   },
      // },
      sequelize,
      modelName: "User",
    }
    // {
    //   sequelize,
    //   modelName: "User",
    // }
  );
  // User.beforeCreate((user, _) => {
  //   return (user.id = uuidv4());
  // });
  return User;
};
