function applyAssociations(sequelize) {
	const { carrinho, modelo, pedidoCompra, produto, usuario } = sequelize.models;

	modelo.hasMany(produto);
	produto.belongsTo(modelo);

    carrinho.hasMany(produto);
    produto.belongsTo(carrinho);

    carrinho.hasOne(pedidoCompra);
    pedidoCompra.belongsTo(carrinho);
}

module.exports = { applyAssociations };