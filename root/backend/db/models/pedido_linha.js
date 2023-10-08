'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido_linha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pedido_linha.hasMany(models.Usuario_avaliacao, {
        foreignKey: {
          name: 'fk_id_pedidoLinha',
          allowNull: false
        }
      })
      Pedido_linha.belongsTo(models.Pedido_compra, {
        foreignKey: {
          name: 'fk_id_pedidoCompra',
          allowNull: false
        }
      })
      Pedido_linha.belongsTo(models.Produto_item, {
        foreignKey: {
          name: 'fk_id_produtoItem',
          allowNull: false
        }
      })
    }
  }
  Pedido_linha.init({
    id_pedidoLinha: {
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
    modelName: 'Pedido_linha',
    timestamps: false,
    freezeTableName: true
  });
  return Pedido_linha;
};