'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Documento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Documento.hasMany(models.Doc_pal_chave, {
        foreignKey: {
          name: 'fk_id_documento',
          allowNull: false
        }
      }),
      Documento.belongsTo(models.Discente, {
        foreignKey: {
          name: 'fk_id_discente',
          allowNull: true //Can be null so a document can be a tutorial or politics
        }
      }),
      Documento.belongsTo(models.Docente, {
        foreignKey: {
          name: 'fk_id_docente',
          allowNull: true //Can be null so a document can be a tutorial or politics
        }
      }),
      Documento.belongsTo(models.Doc_tipo, {
        foreignKey: {
          name: 'fk_id_doc_tipo',
          allowNull: false
        }
      })
    }
  }
  Documento.init({
    id_documento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_doc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome_arq: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resumo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Documento',
    timestamps: false,
    freezeTableName: true
  });
  return Documento;
};