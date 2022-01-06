'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockCartItem = Array.from({ length: 20 }).map((item, index) =>
    ({
      CartId: Math.floor(Math.random() * 3) + 1,
      ProductId: Math.floor(Math.random() * 10) + 1,
      quantity: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    )
    await queryInterface.bulkInsert('CartItems', [...mockCartItem])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CartItems', null, {})
  }
};
