'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuario.hasOne(models.Discente, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      }),
      Usuario.hasOne(models.Docente, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
    }
  }
  Usuario.init({
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
        type: DataTypes.STRING(25)
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    timestamps: false,
    freezeTableName: true
  });
  return Usuario;
};