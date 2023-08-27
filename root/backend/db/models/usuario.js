'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Usuario.init({
    nome: {
        allowNull: false,
        type: DataTypes.STRING
    },
    senha: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING
    },
    endereco: {
        allowNull: true,
        type: DataTypes.STRING
    },
    telefone: {
        allowNull: true,
        type: DataTypes.STRING},
    ultimaVezOnline: {
        allowNull: true,
        type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};