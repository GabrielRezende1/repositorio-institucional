'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto_categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Produto_categoria.hasMany(models.Produto, {
        foreignKey: {
          name: 'fk_id_categoria',
          allowNull: false
        }
      })
      Produto_categoria.hasMany(Produto_categoria, {
        foreignKey: {
          name: 'fk_pai_id_categoria',
          allowNull: false
        }
      })
      Produto_categoria.belongsTo(Produto_categoria, {
        foreignKey: {
          name: 'fk_pai_id_categoria',
          allowNull: false
        }
      })
    }
  }
  Produto_categoria.init({
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Produto_categoria',
    timestamps: false,
    freezeTableName: true
  });
  return Produto_categoria;
};