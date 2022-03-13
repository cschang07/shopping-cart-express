'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'sn', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Orders', 'sn', {
        type: Sequelize.STRING
      })
    } catch (e) { }
  }
};
