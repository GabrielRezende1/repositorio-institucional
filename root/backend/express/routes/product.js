const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/*
/
/:categoria
/:categoria/:subcategoria/...
/produto/:id
*/
//GET /product
router.get("/", getAll = async (req, res) => {
    console.log("Rota GET /produto alcançada!");

    //Limit the amount of products shown on page
    const { page = 1 } = req.query;
    console.log("Page: " + page);
    const limit = 2; //Ideal is 40
    let lastPage = 1;
    const countProduct = await db.Product.count();
    console.log("Product quantity: " + countProduct);

    if (countProduct !== 0) {
        lastPage = Math.ceil(countProduct / limit);
        console.log("lastPage: " + lastPage);
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
    }

    console.log(page * limit - limit);

    //Retrieve all products stored in the database using Sequelize
    const produtos = await db.Product.findAll({
        attributes: ["id", "nome", "sobrenome", "empresa"], //Choose which column to show
        order: [["id", "ASC"]], //Choose order
        //Return the specific startpoint of products and the limit of them on the page
        offset: Number(page * limit - limit),
        limit: limit,
    });

    if (produtos) {
        const pagination = {
            path: "/produto",
            page: page,
            prev_page_url: Number(page) - 1 >= 1 ? Number(page) - 1 : false,
            next_page_url:
                Number(page) + 1 > lastPage ? false : Number(page) + 1,
            lastPage: lastPage,
            total_products: countProduct,
        };

        res.status(200).json({
            mensagem: "Rota produto alcançada!",
            data: produtos,
            pagination: pagination,
        });
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
    }
});

//GET /product/:id
router.get("/:id", getById = async (req, res) => {
    console.log("Rota GET /produto/:id alcançada!");

    const id = req.params.id;

    const produto = await db.Product.findOne({
        attributes: ["nome", "sobrenome", "empresa"],
        where: { id: id },
    });

    if (produto) {
        res.status(200).json({
            mensagem: "Rota produto alcançada!",
            data: produto
        });
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
    }
});

//POST /produto
router.post("/", create = async (req, res) => {
    console.log("Rota POST /produto alcançada!");

    //const dados = req.body; //req.body only because it's json content-type (nome / sobrenome / empresa)

    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const empresa = req.body.empresa;

    await db.Product.create({
        nome,
        sobrenome,
        empresa,
    })
        .then((results) => {
            res.statusCode = 200;
            res.json({ mensagem: "Produto cadastrado!", cadastrado: results });
        })
        .catch((err) => {
            res.statusCode = 500;
            res.json({ error: err });
        });
});

//PUT /produto/:id
router.put("/:id", update = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const empresa = req.body.empresa;

    await db.Product.update(
        {
            nome: nome,
            sobrenome: sobrenome,
            empresa: empresa,
        },
        { where: { id: id } }
    )
        .then((results) => {
            res.status(200).json({
                mensagem: "Produto alterado!",
                alteração: results,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

//DELETE /produto/:id
router.delete("/:id", remove = async (req, res) => {
    const id = req.params.id;

    await db.Product.destroy({
        where: { id: id },
    })
        .then((results) => {
            res.statusCode = 200;
            res.json({ mensagem: "Produto apagado!", deletado: results });
        })
        .catch((err) => {
            res.statusCode = 500;
            res.json({ error: err });
        });
});

module.exports = router;
