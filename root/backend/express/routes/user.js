const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const authToken = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const fileCtrl = require("../middlewares/file.controller");
/* 
/minha-conta
/minha-conta/meus-documentos
/minha-conta/novo-documento
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

        const isStudent = userEmail.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        //TODO usar variável pra mostrar tela de novo cadastro ou do usuário no frontend
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

        res.status(200).json({msg: "Path /minha-conta reached!", userId});
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: "Erro401", error});
    }
});
//Criação de discente/docente de acordo com email pelo db
//POST /minha-conta
router.post('/minha-conta', authToken, async (req, res) => {
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
            where: {email}
        });
        const userId = user.id_usuario;
        const userEmail = user.email;

        const isStudent = userEmail.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);

        let student;
        let teacher;

        if (isStudent) {
            const exists = await db.Discente.findOne({
                where: {fk_id_usuario: userId}
            });

            if(exists) {
                student = await db.Discente.update({
                    matricula,
                    nome,
                    curso
                }, {
                    where: {fk_id_usuario: exists.id_discente}
                });
            }else {
                student = await db.Discente.create({
                    matricula,
                    nome,
                    curso,
                    fk_id_usuario: userId
                });
            }
        }else {
            const exists = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });

            if(exists) {
                teacher = await db.Docente.update({
                        id_funcional,
                        nome,
                        graduacao
                }, {
                    where: {fk_id_usuario: exists.id_docente}
                });
            }else {
                teacher = await db.Docente.create({
                    id_funcional,
                    nome,
                    graduacao,
                    fk_id_usuario: userId
                });
            }
        }
        
        res.status(200).json({msg: "Path /minha-conta reached!", user, student, teacher});
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: "Erro401", error});
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

        const isStudent = userEmail.match(/@(aluno).faeterj-prc.faetec.rj.gov.br/g);
        let checkedUser;
        let docs;
        //Check if it's student or teacher
        if (isStudent) {
            checkedUser = await db.Discente.findOne({
                where: {fk_id_usuario: userId}
            });
            //Retrieve user's documents
            docs = await db.Documento.findAll({
                where: {fk_id_disente: userId}
            });
        }else {
            checkedUser = await db.Docente.findOne({
                where: {fk_id_usuario: userId}
            });
            //Retrieve user's documents
            docs = await db.Documento.findAll({
                where: {fk_id_docente: userId}
            });
        }

        res.status(200).json({msg: 'Path /minha-conta/meus-documentos reached!', userId, docs});
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: "Erro401", error});
    }
});
//GET /minha-conta/novo-documento
router.post('/minha-conta/novo-documento', authToken, fileCtrl.upload, async (req, res) => {
    const titulo = req.body.titulo; //título do trabalho
    const arquivo = req.file.originalname; //nome do arquivo no sistema
    const resumo = req.body.resumo;
    const data = req.body.data;
    const orientador = req.body.orientador; //TODO find fk_id_docente with db query
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

        const type = await db.Doc_tipo.findOne({
            where: {tipo}
        });
        const typeId = type.id_doc_tipo;

        const subject = await db.Assunto.findOrCreate({
            where: {nome: assunto}
        });
        const subjectId = subject[0].dataValues.id_assunto;
        //
        //Creating document
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
        })
        //
        res.status(200).json({
            msg: "Path /minha-conta/novo-documento reached!",
            document,
            doc_subject
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: "Erro401", error});
    }
});

module.exports = router;