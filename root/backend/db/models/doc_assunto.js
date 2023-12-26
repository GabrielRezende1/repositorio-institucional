'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doc_assunto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doc_assunto.belongsTo(models.Assunto, {
        foreignKey: {
          name: 'fk_id_assunto',
          allowNull: false
        }
      });
      Doc_assunto.belongsTo(models.Documento, {
        foreignKey: {
          name: 'fk_id_documento',
          allowNull: false
        }
      })
    }
  }
  Doc_assunto.init({
    id_doc_assunto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    sequelize,
    modelName: 'Doc_assunto',
    timestamps: false,
    freezeTableName: true
  });
  return Doc_assunto;
};