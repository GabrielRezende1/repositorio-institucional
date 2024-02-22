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
 * /minha-conta/meus-documentos/alterar-documento
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
        //Check if it's student or teacher
        if (!isStudent) {
            checkedUser = await db.Docente.findOne({
                where: { fk_id_usuario: userId }
            });
            //Retrieve user's documents
            docs = await db.Documento.findAll({
                where: { fk_id_docente: checkedUser.id_docente }
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
            where: { fk_id_discente: checkedUser.id_discente }
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

        res.status(200).json({ email, teachers });
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
    const assunto = req.body.assunto;

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
         * Politics/ Tutorial docs does not have a subject.
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

            const subject = await db.Assunto.findOrCreate({
                where: {nome: assunto}
            });
            const subjectId = subject[0].dataValues.id_assunto;

            const document = await db.Documento.create({
                nome_doc: titulo,
                nome_arq: arquivo,
                resumo,
                data,
                fk_id_discente: studentId,
                fk_id_docente: teacherId,
                fk_id_doc_tipo: typeId
            });
    
            const doc_subject = await db.Doc_assunto.create({
                fk_id_assunto: subjectId, //"dataValues" because findOrCreate method returns a different object
                fk_id_documento: document.id_documento
            });

            res.status(200).json({
                msg: `Documento '${arquivo}' criado com sucesso!`,
                document,
                doc_subject
            });
        }else { //Fetch data specific to teacher
            const teacher = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });
            const teacherId = teacher.id_docente;

            const subject = await db.Assunto.findOrCreate({
                where: {nome: assunto}
            });
            const subjectId = subject[0].dataValues.id_assunto;

            const document = await db.Documento.create({
                nome_doc: titulo,
                nome_arq: arquivo,
                resumo,
                data,
                fk_id_docente: teacherId,
                fk_id_doc_tipo: typeId
            });
    
            const doc_subject = await db.Doc_assunto.create({
                fk_id_assunto: subjectId, //"dataValues" because findOrCreate method returns a different object
                fk_id_documento: document.id_documento
            });

            res.status(200).json({
                msg: `Documento '${arquivo}' criado com sucesso!`,
                document,
                doc_subject
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
                    fk_id_docente: teacherId
                }
            });
            res.status(200).json({msg: 'Documento do Professor', userId, isStudent, doc});
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
            }
        });
        res.status(200).json({msg: 'Documento do Estudante', userId, isStudent, doc, teachers});
    } catch (err) {
        res.status(401).json({err: {message: err.message, stack: err.stack}});
    }
});
//PUT /minha-conta/meus-documentos/:id/alterar-documento
router.put("/minha-conta/meus-documentos/alterar-documento/:id", authToken, fileCtrl.upload, async (req, res) => {
    const titulo = req.body.titulo; //título do trabalho
    const arquivo = req.file.originalname; //nome do arquivo no sistema
    const resumo = req.body.resumo;
    const data = req.body.data;
    const orientador = req.body.orientador;
    const tipo = req.body.tipo;
    const assunto = req.body.assunto;

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

            const subject = await db.Assunto.findOrCreate({
                where: {nome: assunto}
            });
            const subjectId = subject[0].dataValues.id_assunto;
            //Update user's document
            doc = await db.Documento.update(
                {
                    nome_doc: titulo,
                    nome_arq: arquivo,
                    resumo,
                    data,
                    fk_id_doc_tipo: typeId
                },
                { where: { id_documento: id, fk_id_docente: teacherId} }
            );

            const doc_subject = await db.Doc_assunto.findOrCreate({
                where: {
                    fk_id_assunto: subjectId,
                    fk_id_documento: docId
                }
            });

            res.status(200).json({msg: 'Documentos do Professor', userId, doc, doc_subject});
            return;
        }

        checkedUser = await db.Discente.findOne({
            where: {fk_id_usuario: userId}
        });
        const studentId = checkedUser.id_discente;

        const subject = await db.Assunto.findOrCreate({
            where: {nome: assunto}
        });
        const subjectId = subject[0].dataValues.id_assunto;

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
                nome_arq: arquivo,
                resumo,
                data,
                fk_id_docente: teacherId,
                fk_id_doc_tipo: typeId
            },
            { where: { id_documento: docId, fk_id_discente: studentId } }
        );
        
        const doc_subject = await db.Doc_assunto.findOrCreate({
            where: {
                fk_id_assunto: subjectId,
                fk_id_documento: docId
            }
        });

        res.status(200).json({msg: 'Documentos do Estudante', userId, doc, doc_subject});
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
