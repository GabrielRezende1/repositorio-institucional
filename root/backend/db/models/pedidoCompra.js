'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Produto.init({
    usuario: {
      allowNull: false,
      type: DataTypes.STRING
    },
    dataCompra: {
      allowNull: false,
      type: DataTypes.DATE
    },
    dataEnvio: {
      allowNull: false,
      type: DataTypes.DATE
    },
    enderecoEntrega: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
        allowNull: false,
        type: DataTypes.ENUM({
        values: []
      })
    },
    precoCompra: {
        allowNull: false,
        type: DataTypes.DECIMAL(6,2)
    }
  }, {
    sequelize,
    modelName: 'Produto',
  });
  return Produto;
};