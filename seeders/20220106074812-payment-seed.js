'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockPayment = 
      Array.from({ length: 5 }).map((item, index) =>
      ({
        amount: faker.random.number(),
        serial_number: faker.random.number(),
        payment_method: Math.floor(Math.random() * 3) + 1,
        paid_at: new Date(),
        params: null,
        OrderId: Math.floor(Math.random() * 2) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      )
    await queryInterface.bulkInsert('Payments', [...mockPayment])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Payments', null, {})
  }
};
