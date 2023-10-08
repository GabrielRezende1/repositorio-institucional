'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido_compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pedido_compra.hasMany(models.Pedido_linha, {
        foreignKey: {
          name: 'fk_id_pedidoCompra',
          allowNull: false
        }
      })
      Pedido_compra.belongsTo(models.Endereco, {
        foreignKey: {
          name: 'fk_id_endereco',
          allowNull: false
        }
      })
      Pedido_compra.belongsTo(models.Pedido_status, {
        foreignKey: {
          name: 'fk_id_pedidoStatus',
          allowNull: false
        }
      })
    }
  }
  Pedido_compra.init({
    id_pedidoCompra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    totalCompra: {
      allowNull: false,
      type: DataTypes.DECIMAL(7,2)
    }
  }, {
    sequelize,
    modelName: 'Pedido_compra',
    timestamps: false,
    freezeTableName: true
  });
  return Pedido_compra;
};