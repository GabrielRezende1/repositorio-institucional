'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pedido_status.hasMany(models.Pedido_compra, {
        foreignKey: {
          name: 'fk_id_pedidoStatus',
          allowNull: false
        }
      })
    }
  }
  Pedido_status.init({
    id_pedidoStatus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantidade: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    preco: {
      allowNull: false,
      type: DataTypes.DECIMAL(7,2)
    }
  }, {
    sequelize,
    modelName: 'Pedido_status',
    timestamps: false,
    freezeTableName: true
  });
  return Pedido_status;
};