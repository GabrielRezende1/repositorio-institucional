'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Palavra_chave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Palavra_chave.hasMany(models.Doc_pal_chave, {
        foreignKey: {
          name: 'fk_id_palavra_chave',
          allowNull: false
        }
      })
    }
  }
  Palavra_chave.init({
    id_palavra_chave: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING(60)
    }
  }, {
    sequelize,
    modelName: 'Palavra_chave',
    timestamps: false,
    freezeTableName: true
  });
  return Palavra_chave;
};