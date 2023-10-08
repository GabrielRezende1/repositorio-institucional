'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Produto_item.belongsTo(models.Produto, {
        foreignKey: {
          name: 'fk_id_produto',
          allowNull: false
        }
      })
      Produto_item.hasMany(models.Carrinho_item, {
        foreignKey: {
          name: 'fk_id_produtoItem',
          allowNull: false
        }
      })
      Produto_item.hasMany(models.Pedido_linha, {
        foreignKey: {
          name: 'fk_id_produtoItem',
          allowNull: false
        }
      })
    }
  }
  Produto_item.init({
    id_produtoItem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sku: {
      allowNull: false,
      type: DataTypes.STRING
    },
    quantidadeEstoque: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    preco: {
      allowNull: false,
      type: DataTypes.DECIMAL(7,2)
  }
  }, {
    sequelize,
    modelName: 'Produto_item',
    timestamps: false,
    freezeTableName: true
  });
  return Produto_item;
};