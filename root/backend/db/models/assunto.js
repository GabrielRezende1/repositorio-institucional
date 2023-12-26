'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assunto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Assunto.hasMany(models.Doc_assunto, {
        foreignKey: {
          name: 'fk_id_assunto',
          allowNull: false
        }
      })
    }
  }
  Assunto.init({
    id_assunto: {
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
    modelName: 'Assunto',
    timestamps: false,
    freezeTableName: true
  });
  return Assunto;
};