"use strict";
const { v4: uuidv4 } = require("uuid");
const { genSaltSync, hashSync } = require("bcrypt");
const salt = genSaltSync(5);

module.exports = {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        first_name: "John",
        last_name: "Doe",
        email: "example@example.com",
        password: hashSync("test@1234", salt),
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: null,
      },
    ]);
  },

  //   /**
  //    * Add commands to revert seed here.
  //    *
  //    * Example:
  //    * await queryInterface.bulkDelete('People', null, {});
  //    */

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
