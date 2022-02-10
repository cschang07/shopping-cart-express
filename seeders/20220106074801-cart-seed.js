'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockCart = Array.from({ length: 5 }).map((item, index) => ({
      id: index + 1,
      UserId: index + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    )
    await queryInterface.bulkInsert('Carts', [...mockCart])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {})
  }
};
