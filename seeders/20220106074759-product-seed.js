'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const mockProducts = Array.from({ length: 12 }).map((d, i) => ({
      id: i + 1,
      name: `JEANS 00${i + 1}`,
      description: faker.commerce.product() + '/' + faker.commerce.productName(),
      price: faker.commerce.price(),
      image: `https://loremflickr.com/320/240/fashion/?random=${Math.random() * 100}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    await queryInterface.bulkInsert('Products', [...mockProducts])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
};
