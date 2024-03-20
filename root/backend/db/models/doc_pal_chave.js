'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doc_pal_chave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doc_pal_chave.belongsTo(models.Palavra_chave, {
        foreignKey: {
          name: 'fk_id_palavra_chave',
          allowNull: false
        }
      });
      Doc_pal_chave.belongsTo(models.Documento, {
        foreignKey: {
          name: 'fk_id_documento',
          allowNull: false
        }
      })
    }
  }
  Doc_pal_chave.init({
    id_doc_pal_chave: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    sequelize,
    modelName: 'Doc_pal_chave',
    timestamps: false,
    freezeTableName: true
  });
  return Doc_pal_chave;
};