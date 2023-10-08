'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario_avaliacao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuario_avaliacao.belongsTo(models.Usuario, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
      Usuario_avaliacao.belongsTo(models.Pedido_linha, {
        foreignKey: {
          name: 'fk_id_pedidoLinha',
          allowNull: false
        }
      })
    }
  }
  Usuario_avaliacao.init({
    id_usuarioAvaliacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estrelas: {
      allowNull: false,
      type: DataTypes.ENUM({
        values: ['1','2','3','4','5']
      })
    },
    comentario: {
        allowNull: true,
        type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Usuario_avaliacao',
    timestamps: false,
    freezeTableName: true
  });
  return Usuario_avaliacao;
};