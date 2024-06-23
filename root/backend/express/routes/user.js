const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const authToken = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const fileCtrl = require("../middlewares/file.controller");
const fs = require("fs");
const idParam = require("../middlewares/idParam");
/**
 * /minha-conta
 * /minha-conta/meus-documentos
 * /minha-conta/novo-documento
 * /minha-conta/meus-documentos/alterar-documento/:id (without file upload)
 * /minha-conta/meus-documentos/alterar-documento/:id/upload (only file upload)
 * 
 * OBS: Document visualization and download is
 * handled by document.js since it's public
 */
//GET /minha-conta
router.get('/minha-conta', authToken, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;
    
        const user = await db.Usuario.findOne({
            where: {email}
        });
        const userId = user.id_usuario;

        const isStudent = email.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        let checkedUser;

        if (isStudent) {
            checkedUser = await db.Discente.findOne({
                where: {fk_id_usuario: userId}
            });
        }else {
            checkedUser = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });
        }

        res.status(200).json({ userId, email, checkedUser, isStudent });
    } catch (err) {
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//Criação de discente/docente de acordo com email pelo db
//POST /minha-conta
router.post("/minha-conta", authToken, async (req, res) => {
    const nome = req.body.nome;
    const matricula = req.body.matricula; //Para discente
    const curso = req.body.curso; //Para discente
    const graduacao = req.body.graduacao; //Para docente
    const id_funcional = req.body.id_funcional; //Para docente

    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;

        const user = await db.Usuario.findOne({
            where: { email },
        });
        const userId = user.id_usuario;

        const isStudent = email.match(
            /@(aluno).faeterj-prc.faetec.rj.gov.br/g
        );

        let student;
        let teacher;

        if (!isStudent) {
            const exists = await db.Docente.findOne({
                where: { fk_id_usuario: userId },
            });

            if (!exists) {
                teacher = await db.Docente.create({
                    id_funcional,
                    nome,
                    graduacao,
                    fk_id_usuario: userId,
                });
                res.status(200).json({
                    msg: "Professor criado!",
                    user,
                    teacher,
                });
                return;
            }
            teacher = await db.Docente.update(
                {
                    id_funcional,
                    nome,
                    graduacao,
                },
                {
                    where: { fk_id_usuario: exists.fk_id_usuario },
                }
            );
            res.status(200).json({
                msg: "Professor atualizado!",
                user,
                teacher,
            });
            return;
        }

        const exists = await db.Discente.findOne({
            where: { fk_id_usuario: userId },
        });

        if (!exists) {
            student = await db.Discente.create({
                matricula,
                nome,
                curso,
                fk_id_usuario: userId,
            });
            res.status(200).json({ msg: "Estudante criado!", user, student });
            return;
        }

        student = await db.Discente.update(
            {
                matricula,
                nome,
                curso,
            },
            {
                where: { fk_id_usuario: exists.fk_id_usuario },
            }
        );

        res.status(200).json({ msg: "Estudante atualizado!", user, student });
        return;
    } catch (err) {
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//GET /minha-conta/meus-documentos
router.get('/minha-conta/meus-documentos', authToken, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;
    
        const user = await db.Usuario.findOne({
            where: {email}
        });
        const userId = user.id_usuario;

        const isStudent = email.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        let checkedUser;
        let docs;
        //Check if it's admin
        if (email == "Admin") {
            docs = await db.Documento.findAll({
                attributes: {
                    include: [
                        "nome_doc",
                        "nome_arq",
                        "resumo",
                        [db.Sequelize.fn(
                            "DATE_FORMAT", 
                            db.Sequelize.col("data"), 
                            "%d/%m/%Y"
                        ), "data"],
                        "fk_id_docente",
                        "fk_id_doc_tipo"
                    ]
                },
                include: ["Doc_tipo"]
            });
            res.status(200).json({
                msg: 'Todos os documentos para o Admin', userId, docs, email, isStudent
            });
            return;
        }
        /**
         * 
         */
        //Check if it's student or teacher
        if (!isStudent) {
            checkedUser = await db.Docente.findOne({
                where: { fk_id_usuario: userId }
            });
            //Retrieve user's documents
            docs = await db.Documento.findAll({
                where: { fk_id_docente: checkedUser.id_docente },
                attributes: {
                    include: [
                        "nome_doc",
                        "nome_arq",
                        "resumo",
                        [db.Sequelize.fn(
                            "DATE_FORMAT", 
                            db.Sequelize.col("data"), 
                            "%d/%m/%Y"
                        ), "data"],
                        "fk_id_docente",
                        "fk_id_doc_tipo"
                    ]
                },
                include: ["Doc_tipo"]
            });
            res.status(200).json({
                msg: 'Documentos do Professor', userId, docs
            });
            return;
        }

        checkedUser = await db.Discente.findOne({
            where: {fk_id_usuario: userId}
        });
        //Retrieve user's documents
        docs = await db.Documento.findAll({
            where: { fk_id_discente: checkedUser.id_discente },
            attributes: {
                include: [
                    "nome_doc",
                    "nome_arq",
                    "resumo",
                    [db.Sequelize.fn(
                        "DATE_FORMAT", 
                        db.Sequelize.col("data"), 
                        "%d-%m-%Y"
                    ), "data"],
                    "fk_id_discente",
                    "fk_id_docente",
                    "fk_id_doc_tipo"
                ]
            },
            include: ["Doc_tipo", "Docente"]
        });
        res.status(200).json({ msg: 'Documentos do Estudante', userId, docs });
    } catch (err) {
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//GET /minha-conta/novos-documentos (Just to access post request)
router.get("/minha-conta/novo-documento", authToken, async (req, res) => {
    try {
        //Check if token exists
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;

        // Teachers dropdown list for when student creates a new doc
        const isStudent = email.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        let teachers
        if (isStudent) {
            teachers = await db.Docente.findAll();
        }

        res.status(200).json({ email, teachers, isStudent });
    } catch (err) {
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//TODO Fazer o upload primeiro não é bom (Apagar o arquivo em caso de erro também)
//POST /minha-conta/novo-documento
router.post('/minha-conta/novo-documento', authToken, fileCtrl.upload, async (req, res) => {
    const titulo = req.body.titulo; //título do trabalho
    const arquivo = req.file.originalname; //nome do arquivo no sistema
    const resumo = req.body.resumo;
    const data = req.body.data;
    const orientador = req.body.orientador;
    const tipo = req.body.tipo;
    const palavraChave = req.body.palavraChave;

    try {
        //Check if token exists
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;
        //Fetching data
        const user = await db.Usuario.findOne({
            where: {email}
        });
        const userId = user.id_usuario;

        const type = await db.Doc_tipo.findOne({
            where: {tipo}
        });
        const typeId = type.id_doc_tipo;
        //
        /**
         * Creating document with Admin.
         * Only admins are capable of
         * creating Politics or Tutorial docs.
         * Politics/ Tutorial docs does not have a keyword.
         */
        if (email == "Admin") {
            const document = await db.Documento.create({
                nome_doc: titulo,
                nome_arq: arquivo,
                data,
                fk_id_doc_tipo: typeId
            });
    
            res.status(200).json({
                msg: `Documento "${arquivo}" criado com sucesso!`,
                document
            });
            return;
        }
        //
        /**
         * Creating document with Student/Teacher
         * Student/Teacher can't create a Politics or Tutorial doc
         */
        if (typeId == 9 || typeId == 10) {
            fs.unlinkSync(`${__basedir}../../db/documents/${arquivo}`);
            res.status(401).json({
                msg: "Você escolheu um tipo de documento restrito!"
            });
            return;
        }

        const isStudent = email.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);

        if (isStudent) {
            //Fetch data specific to student
            const student = await db.Discente.findOne({
                where: {fk_id_usuario: userId}
            });
            const studentId = student.id_discente;
    
            const teacher = await db.Docente.findOne({
                where: {
                    nome: {
                        [db.Sequelize.Op.like]: orientador
                    }
                }
            });
            const teacherId = teacher.id_docente;

            const keyword = await db.Palavra_chave.findOrCreate({
                where: {nome: palavraChave}
            });
            const keywordId = keyword[0].dataValues.id_palavra_chave;

            const document = await db.Documento.create({
                nome_doc: titulo,
                nome_arq: arquivo,
                resumo,
                data,
                fk_id_discente: studentId,
                fk_id_docente: teacherId,
                fk_id_doc_tipo: typeId
            });
    
            const docKeyword = await db.Doc_pal_chave.create({
                fk_id_palavra_chave: keywordId, //"dataValues" because findOrCreate method returns a different object
                fk_id_documento: document.id_documento
            });

            res.status(200).json({
                msg: `Documento '${arquivo}' criado com sucesso!`,
                document,
                docKeyword
            });
        }else { //Fetch data specific to teacher
            const teacher = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });
            const teacherId = teacher.id_docente;

            const keyword = await db.Palavra_chave.findOrCreate({
                where: {nome: palavraChave}
            });
            const keywordId = keyword[0].dataValues.id_palavra_chave;

            const document = await db.Documento.create({
                nome_doc: titulo,
                nome_arq: arquivo,
                resumo,
                data,
                fk_id_docente: teacherId,
                fk_id_doc_tipo: typeId
            });
    
            const docKeyword = await db.Doc_pal_chave.create({
                fk_id_palavra_chave: keywordId, //"dataValues" because findOrCreate method returns a different object
                fk_id_documento: document.id_documento
            });

            res.status(200).json({
                msg: `Documento '${arquivo}' criado com sucesso!`,
                document,
                docKeyword
            });
        }
    } catch (err) {
        fs.unlinkSync(`${__basedir}../../db/documents/${arquivo}`);
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
/**
 * GET /minha-conta/meus-documentos/alterar-documento/:id
 * Pega o conteúdo do documento e passa para os inputs do HTML
 * para o usuário alterar o que quer
 * antes de requisitar a alteração do documento.
 */
router.get("/minha-conta/meus-documentos/alterar-documento/:id", authToken, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;

        const docId = idParam(req);

        const user = await db.Usuario.findOne({
            where: {email}
        });
        const userId = user.id_usuario;

        const docKeyword = await db.Doc_pal_chave.findAll({
            where: {fk_id_documento: docId},
            include: ["Palavra_chave"]
        });
        
        const isStudent = email.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        let checkedUser;
        let doc;

        if (!isStudent) {
            checkedUser = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });
            const teacherId = checkedUser.dataValues.id_docente;
            //Retrieve user document
            doc = await db.Documento.findOne({
                where: {
                    id_documento: docId,
                    fk_id_docente: teacherId,
                },
                include: ["Doc_tipo"]
            });
            res.status(200).json({msg: 'Documento do Professor', userId, isStudent, doc, docKeyword});
            return;
        }

        checkedUser = await db.Discente.findOne({
            where: {fk_id_usuario: userId}
        });
        const studentId = checkedUser.dataValues.id_discente;

        const teachers = await db.Docente.findAll();
        //Retrieve user document
        doc = await db.Documento.findOne({
            where: {
                id_documento: docId,
                fk_id_discente: studentId
            },
            include: ["Doc_tipo", "Docente"]
        });
        res.status(200).json({msg: 'Documento do Estudante', userId, isStudent, doc, teachers, docKeyword});
    } catch (err) {
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//PUT /minha-conta/meus-documentos/:id/alterar-documento (without file upload)
router.put("/minha-conta/meus-documentos/alterar-documento/:id", authToken, async (req, res) => {
    const titulo = req.body.titulo; //título do trabalho
    const resumo = req.body.resumo;
    const data = req.body.data;
    const orientador = req.body.orientador;
    const tipo = req.body.tipo;
    const palavraChave = req.body.palavraChave.split(",");

    const docId = idParam(req);

    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;

        const isStudent = email.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        let checkedUser;
        let doc;

        //Fetching data (common on both student/teacher)
        const user = await db.Usuario.findOne({
            where: {email}
        });
        const userId = user.id_usuario;

        const type = await db.Doc_tipo.findOne({
            where: {tipo}
        });
        const typeId = type.id_doc_tipo;
        //

        if (!isStudent) {
            //Fetch data specific to student/teacher
            checkedUser = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });
            const teacherId = checkedUser.id_docente;

            const keyword = await db.Palavra_chave.findOrCreate({
                where: {nome: palavraChave}
            });
            const keywordId = keyword[0].dataValues.id_palavra_chave;
            //Update user's document
            doc = await db.Documento.update(
                {
                    nome_doc: titulo,
                    resumo,
                    data,
                    fk_id_doc_tipo: typeId
                },
                { where: { id_documento: id, fk_id_docente: teacherId} }
            );

            const docKeyword = await db.Doc_pal_chave.findOrCreate({
                where: {
                    fk_id_palavra_chave: keywordId,
                    fk_id_documento: docId
                }
            });

            res.status(200).json({msg: 'Documentos do Professor', userId, doc, docKeyword});
            return;
        }

        checkedUser = await db.Discente.findOne({
            where: {fk_id_usuario: userId}
        });
        const studentId = checkedUser.id_discente;

        const keywords = [];
        const keywordsId = [];
        for (let i = 0; i < palavraChave.length; i++) {
            const palavraChaveSingle = palavraChave[i].trim();

            const keyword = await db.Palavra_chave.findOrCreate({
                where: {nome: palavraChaveSingle}
            });
            keywordsId.push(keyword[0].dataValues.id_palavra_chave);
            keywords.push(palavraChaveSingle);
        }
/*         const keyword = await db.Palavra_chave.findOrCreate({
            where: {nome: palavraChave}
        });
        const keywordId = keyword[0].dataValues.id_palavra_chave; */

        const teacher = await db.Docente.findOne({
            where: {
                nome: {
                    [db.Sequelize.Op.like]: orientador
                }
            }
        });
        const teacherId = teacher.id_docente;
        //Update user's document
        doc = await db.Documento.update(
            {
                nome_doc: titulo,
                resumo,
                data,
                fk_id_docente: teacherId,
                fk_id_doc_tipo: typeId
            },
            { where: { id_documento: docId, fk_id_discente: studentId } }
        );
        
        docKeywords = [];
        for (let i = 0; i < keywordsId.length; i++) {
            const keywordsIdSingle = keywordsId[i];
            
            const docKeyword = await db.Doc_pal_chave.findOrCreate({
                where: {
                    fk_id_palavra_chave: keywordsIdSingle,
                    fk_id_documento: docId
                }
            });
            docKeywords.push(docKeyword);
        }
/*         const docKeyword = await db.Doc_pal_chave.findOrCreate({
            where: {
                fk_id_palavra_chave: keywordId,
                fk_id_documento: docId
            }
        }); */

        res.status(200).json({msg: 'Documentos do Estudante', userId, doc, docKeywords});
        return;
    } catch (err) {
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//PUT /minha-conta/meus-documentos/alterar-documento/:id/upload (only file upload)
router.put('/minha-conta/meus-documentos/alterar-documento/:id/upload', authToken, fileCtrl.upload, async (req, res) => {
    const arquivo = req.file.originalname; //nome do arquivo no sistema

    const docId = idParam(req);

    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;

        const isStudent = email.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        let checkedUser;
        let doc;
        let oldFileName;

        const user = await db.Usuario.findOne({
            where: {email}
        });
        const userId = user.id_usuario;

        if (!isStudent) {
            //Fetch data specific to student/teacher
            checkedUser = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });
            const teacherId = checkedUser.id_docente;
            //Get user's old file name
            oldFileName = await db.Documento.findOne({
                where: {id_documento: docId}
            });
            oldFileName = oldFileName.nome_arq;
            //Update user's document
            doc = await db.Documento.update(
                {
                    nome_arq: arquivo
                },
                { where: { id_documento: id, fk_id_docente: teacherId} }
            );
            // Delete oldFileName after updated name is successful
            fs.unlinkSync(`${__basedir}../../db/documents/${oldFileName}`);
            res.status(200).json({msg: 'Arquivo do professor alterado', userId, doc, oldFileName});
            return;
        }

        checkedUser = await db.Discente.findOne({
            where: {fk_id_usuario: userId}
        });
        const studentId = checkedUser.id_discente;
        //Get user's old file name
        oldFileName = await db.Documento.findOne({
            where: {id_documento: docId}
        });
        oldFileName = oldFileName.nome_arq;
        //Update user's document
        doc = await db.Documento.update(
            {
                nome_arq: arquivo
            },
            { where: { id_documento: docId, fk_id_discente: studentId } }
        );
        // Delete oldFileName after updated name is successful
        fs.unlinkSync(`${__basedir}../../db/documents/${oldFileName}`);
        res.status(200).json({msg: 'Arquivo do estudante alterado', userId, doc, oldFileName});
        return;
    } catch (err) {
        fs.unlinkSync(`${__basedir}../../db/documents/${arquivo}`);
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//TODO Pensar sobre deletar docs
//DELETE /minha-conta/:id/:nome
router.delete("minha-conta/meus-documentos/:id/:nome", authToken, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.decode(token);
    const email = decoded.email;
    
    const id = idParam(req);

    await db.Documento.destroy({
        where: { id_documento: id },
    })
        .then((results) => {
            res.status(200).json({
                mensagem: "Documento apagado!",
                deletado: results,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;
