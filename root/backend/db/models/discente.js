'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discente.hasMany(models.Documento, {
        foreignKey: {
          name: 'fk_id_discente',
          allowNull: true //Can be null so a document can be a tutorial or politics
        }
      }),
      Discente.belongsTo(models.Usuario, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
    }
  }
  Discente.init({
    id_discente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    matricula: {
      type: DataTypes.INTEGER,
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING
    },
    curso: {
        allowNull: true,
        type: DataTypes.ENUM({
            values: ['GA', 'SI']
        })
    },
    turno: {
        allowNull: false,
        type: DataTypes.ENUM({
            values: ['Manhã', 'Noite']
        })
    }
  }, {
    sequelize,
    modelName: 'Discente',
    timestamps: false,
    freezeTableName: true
  });
  return Discente;
};