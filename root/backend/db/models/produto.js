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
      Produto.belongsTo(models.Produto_categoria, {
        foreignKey: {
          name: 'fk_id_categoria',
          allowNull: false
        }
      })
      Produto.hasMany(models.Produto_item, {
        foreignKey: {
          name: 'fk_id_produto',
          allowNull: false
        }
      })
    }
  }
  Produto.init({
    id_produto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING
    },
    descricao: {
      allowNull: false,
      type: DataTypes.STRING
    },
    imagem: {
      allowNull: false,
      type: DataTypes.BLOB
    }
  }, {
    sequelize,
    modelName: 'Produto',
    timestamps: false,
    freezeTableName: true
  });
  return Produto;
};