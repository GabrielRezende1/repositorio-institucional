'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example: */
      await queryInterface.bulkInsert('Products', [{
        nome: 'Billy',
        sobrenome: 'Max',
        empresa: 'Vega Brothers',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example: */
      await queryInterface.bulkDelete('Products', null, {});
     
  }
};
