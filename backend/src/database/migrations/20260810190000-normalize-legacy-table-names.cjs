'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables({ transaction });

      if (tables.includes('inidicador') && !tables.includes('indicadores')) {
        await queryInterface.renameTable('inidicador', 'indicadores', { transaction });
      }

      if (tables.includes('Contato')) {
        const [rows] = await queryInterface.sequelize.query(
          'SELECT COUNT(*)::integer AS total FROM "Contato"',
          { transaction },
        );
        if (rows[0].total !== 0) {
          throw new Error('A tabela legada "Contato" contém dados e não pode ser removida automaticamente');
        }
        await queryInterface.dropTable('Contato', { transaction });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables({ transaction });
      if (tables.includes('indicadores') && !tables.includes('inidicador')) {
        await queryInterface.renameTable('indicadores', 'inidicador', { transaction });
      }
    });
  },
};
