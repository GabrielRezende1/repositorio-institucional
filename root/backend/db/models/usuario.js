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
      Usuario.belongsToMany(models.Endereco, {
        through: models.Endereco_usuario,
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
      Usuario.hasMany(models.Usuario_avaliacao, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
      Usuario.hasMany(models.Usuario_pagamento, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
      Usuario.hasMany(models.Carrinho, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
    }
  }
  Usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
        allowNull: false,
        type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
  },
    senha: {
        allowNull: false,
        type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    timestamps: false,
    freezeTableName: true
  });
  return Usuario;
};