'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Docente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Docente.hasMany(models.Documento, {
        foreignKey: {
          name: 'fk_id_docente',
          allowNull: true //Can be null so a document can be a tutorial or politics
        }
      }),
      Docente.belongsTo(models.Usuario, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
    }
  }
  Docente.init({
    id_docente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    graduacao: {
        type: DataTypes.STRING(60),
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Docente',
    timestamps: false,
    freezeTableName: true
  });
  return Docente;
};