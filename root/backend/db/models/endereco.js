'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Endereco extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Endereco.belongsToMany(models.Usuario, {
          through: models.Endereco_usuario,
          foreignKey: {
            name: 'fk_id_endereco',
            allowNull: false
          }
      });
      Endereco.hasMany(models.Pedido_compra, {
        foreignKey: {
          name: 'fk_id_endereco',
          allowNull: false
        }
      });
    }
  }
  Endereco.init({
    id_endereco: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cep: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    cidade: {
        allowNull: false,
        type: DataTypes.STRING
    },
    bairro: {
        allowNull: false,
        type: DataTypes.STRING
    },
    logradouro: {
        allowNull: false,
        type: DataTypes.STRING
    },
    numero: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    complemento: {
        allowNull: true,
        type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Endereco',
    timestamps: false,
    freezeTableName: true
  });
  return Endereco;
};