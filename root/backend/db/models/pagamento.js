'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pagamento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pagamento.init({
    nome: {
      allowNull: false,
      type: DataTypes.STRING
    },
    descricao: {
      allowNull: false,
      type: DataTypes.STRING
    },
    precoPraticado: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    imagem: {
      allowNull: false,
      type: DataTypes.BLOB,
    },
    categoria: {
      type: DataTypes.ENUM({
        values: ['Eletrônico', 'Casa', 'Entretenimento', 'Esporte', 'Beleza', 'Segurança']
      })
    }
  }, {
    sequelize,
    modelName: 'Pagamento',
  });
  return Pagamento;
};