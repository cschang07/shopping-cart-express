'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'facebookId', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Users', 'facebookId', {
        type: Sequelize.STRING
      })
    } catch (e) { }
  }
};
