'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doc_tipo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { // Model associations
      Doc_tipo.hasMany(models.Documento, {
        foreignKey: {
          name: 'fk_id_doc_tipo',
          allowNull: false
        }
      });
    }
  }
  Doc_tipo.init({ // Model attributes
    id_doc_tipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
  }, { // Model options
    sequelize,
    modelName: 'Doc_tipo',
    timestamps: false,
    tableName: 'doc_tipos'
  });
  return Doc_tipo;
};