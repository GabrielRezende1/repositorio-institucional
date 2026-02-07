'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { // Model associations
      Usuario.hasOne(models.Discente, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      });
      Usuario.hasOne(models.Docente, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      });
    }
  }
  Usuario.init({ // Model attributes
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    senha: {
        allowNull: false,
        type: DataTypes.STRING(150)
    }
  }, { // Model options
    sequelize,
    modelName: 'Usuario',
    timestamps: false,
    tableName: 'usuarios'
  });
  return Usuario;
};