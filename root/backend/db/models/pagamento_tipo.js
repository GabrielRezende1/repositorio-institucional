'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pagamento_tipo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pagamento_tipo.hasMany(models.Usuario_pagamento, {
        foreignKey: {
          name: 'fk_id_pagamentoTipo',
          allowNull: false
        }
      })
    }
  }
  Pagamento_tipo.init({
    id_pagamentoTipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      allowNull: false,
      type: DataTypes.ENUM({
        values: ['C', 'D', 'P']
      })
    }
  }, {
    sequelize,
    modelName: 'Pagamento_tipo',
    timestamps: false,
    freezeTableName: true
  });
  return Pagamento_tipo;
};