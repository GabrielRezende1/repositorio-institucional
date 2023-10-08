'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario_pagamento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuario_pagamento.belongsTo(models.Usuario, {
        foreignKey: {
          name: 'fk_id_usuario',
          allowNull: false
        }
      })
      Usuario_pagamento.belongsTo(models.Pagamento_tipo, {
        foreignKey: {
          name: 'fk_id_pagamentoTipo',
          allowNull: false
        }
      })
    }
  }
  Usuario_pagamento.init({
    id_usuarioPagamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fornecedor: {
      allowNull: false,
      type: DataTypes.ENUM({
        values: ['M', 'V', 'P']
      })
    },
    numero: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    dataExpiracao: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Usuario_pagamento',
    timestamps: false,
    freezeTableName: true
  });
  return Usuario_pagamento;
};