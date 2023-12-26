'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doc_tipo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doc_tipo.hasMany(models.Documento, {
        foreignKey: {
          name: 'fk_id_doc_tipo',
          allowNull: false
        }
      })
    }
  }
  Doc_tipo.init({
    id_doc_tipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Doc_tipo',
    timestamps: false,
    freezeTableName: true
  });
  return Doc_tipo;
};