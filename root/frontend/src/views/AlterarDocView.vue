<script>
import axios from 'axios';
import MenuBar from '@/components/MenuBar.vue';
export default {
    data() {
        return {
            info: {},
            info2: {}, //uploadFile()
            former_nome_doc: '', // <h1>
            updatedDoc: '', // <span>
            updatedFile: '', // <span>,
            validFile: false,
            file: null, //readFile()
            //Doc data
            nome_doc: '',
            resumo: '',
            data: '',
            orientador: '',
            tipo: '', //doc_tipo
            palavraChave: []
        }
    },

    methods: {
        readFile() {
            this.file = this.$refs.file.files[0];
            if (this.file.name.includes('.pdf')) {
                this.validFile = true;
            }else {
                this.validFile = false;
            }
        },

        putAlterarDoc(id) {
            axios.put(`http://localhost:3000/api/minha-conta/meus-documentos/alterar-documento/${id}`,
            {
                titulo: this.nome_doc,
                resumo: this.resumo,
                data: this.data,
                orientador: this.orientador,
                tipo: this.tipo,
                palavraChave: this.palavraChave
            })
            .then(res => {
                this.info = res.data;
                this.updatedDoc = 'Documento alterado com sucesso!';
                console.log(this.info);
            })
            .catch(err => {
                console.log(err.response.data);
            });
        },

        uploadFile(id) {
            if (!this.validFile) return;

            const form = new FormData();
            form.append('arquivo', new Blob([this.file], {type: 'application/pdf'}), this.file.name);

            axios.put(`http://localhost:3000/api/minha-conta/meus-documentos/alterar-documento/${id}/upload`,
            form)
            .then(res => {
                this.info2 = res.data;
                this.updatedFile = 'Arquivo alterado com sucesso!';
                console.log(this.info2);
                console.log(form.get('arquivo'));
            })
            .catch(err => {
                console.log(err.response.data);
            });
        }
    },
    
    beforeCreate() {
        axios
            .get('http://localhost:3000/api/minha-conta/meus-documentos/alterar-documento/'
            + this.$route.params.id)
            .then((res) => {
            this.info = res.data;
            console.log(this.info);
            
            this.former_nome_doc = this.info.doc.nome_doc;
            this.nome_doc = this.info.doc.nome_doc,
            this.resumo = this.info.doc.resumo,
            this.data = this.info.doc.data,
            this.orientador = this.info.doc.Docente.nome,
            this.tipo = this.info.doc.Doc_tipo.tipo,
            this.palavraChave = this.info.docKeyword
                .map(el => el.Palavra_chave.nome);

            //this.palavraChave.map(el => el.Palavra_chave.nome);
        })
            .catch((err) => {
            console.log(err.response.data);
            this.$router.push('/');
        });
    },

    mounted() {
        //Set max date to today
        const date = document.getElementById('data');
        //Get correct YYYY-MM-DD format used in html date tag
        date.max = new Date().toISOString().split("T")[0];
    },

    components: { MenuBar }
}
</script>

<template>
    <section>
        <MenuBar />
        <br>
        <h1>Alterando: <b>{{ former_nome_doc }}</b></h1>
        <hr>
        <form action="" method="post" @submit.prevent="putAlterarDoc(info.doc.id_documento)">
            <label for="tipo">Tipo de Documento:</label>
            <select name="tipo" id="tipo" v-model="tipo">
                <option id="Artigo de Evento" value="Artigo de Evento">Artigo de Evento</option>
                <option id="Artigo de Periódico" value="Artigo de Periódico">Artigo de Periódico</option>
                <option id="Capítulo de Livro" value="Capítulo de Livro">Capítulo de Livro</option>
                <option id="Dissertação" value="Dissertação">Dissertação</option>
                <option id="Livro" value="Livro">Livro</option>
                <option id="Monografia" value="Monografia">Monografia</option>
                <option id="Tese" value="Tese">Tese</option>
                <option id="Trabalho de Conclusão de Curso" value="Trabalho de Conclusão de Curso">Trabalho de Conclusão de Curso</option>
            </select>
            <label for="nome_doc">Título:</label>
            <input type="text" id="nome_doc" v-model="nome_doc" required />
            <label for="resumo">Resumo:</label>
            <textarea name="resumo" id="resumo" v-model="resumo" cols="40" rows="10" required></textarea>
            <label for="palavraChave">Palavras-Chave: (Separar itens por VÍRGULA)</label>
            <input type="text" id="palavraChave" v-model="palavraChave" />
            <label for="data">Data:</label>
            <input type="date" id="data" v-model="data" required />
            <label v-if="info.isStudent" for="orientador">Orientador:</label>
            <select v-if="info.isStudent" name="orientador" id="orientador" v-model="orientador" required>
                <option v-for="teacher in info.teachers" :key="teacher" :value="teacher.nome">
                    {{ teacher.nome }}
                </option>
            </select>
            <input type="submit" value="Atualizar Documento"/>
            <span v-if="updatedDoc">{{ updatedDoc }}</span>
        </form>
        <hr>
        <form action="" enctype="multipart/form-data" @submit.prevent="uploadFile(info.doc.id_documento)">
            <label for="file">Selecionar Arquivo: </label>
            <input type="file" id="file" accept=".pdf" ref="file" @change="readFile" required/>
            <input type="submit" value="Atualizar Arquivo">
            <span v-if="updatedFile">{{ updatedFile }}</span>
        </form>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    margin: 2rem 0;
}

h1 {
    color: var(--black);
    font-weight: 600;
    margin: 0 auto;
    text-align: center;
}

hr {
    color: var(--blue);
    margin: 1rem 0;
}

form {
  width: 800px;
  margin: 0 auto;
}

label {
  font-size: 16px;
  padding: 0 2rem;
  color: var(--black);
  font-weight: 600;
}

input[type=text], 
input[type=date],
input[type=file],
select,
textarea {
  display: block;
  width: 85%;
  height: 48px;

  padding-left: 1rem;
  font-size: 20px;
  margin: 0.5rem auto 2rem auto;
  border-radius: 10px;
  outline: 0;
  border: 0;
  resize: none;

  transition: 0.4s;
}

input[type=text]:focus,
input[type=password]:focus,
textarea:focus {
  font-size: 22px;
}

textarea {
  height: 200px;

  resize: none;
  padding: 0.5rem 1rem;
}

input[type=submit] {
  display: block;
  width: 30%;
  height: 48px;

  font-size: 20px;
  font-weight: 600;
  margin: 0 auto 1rem auto;
  border-radius: 10px;
  border: 0;
  background-color: var(--yellow);
  color: var(--black);
  cursor: pointer;

  transition: 0.4s;
}

input[type=submit]:hover {
  background-color: var(--blue);
  color: white;
  font-size: 21px;
}
/**Blink when update is successful */
span {
  display: block;
  margin: 0 auto;
  width: fit-content;
  background-color: rgba(0, 255, 0, 0.3);
  border-radius: 5px;
  padding: 0 5px;
  
  animation-name: blinkSpan;
  animation-duration: 0.4s;
  animation-iteration-count: 3;
}

@keyframes blinkSpan {
  50% {
    background-color: green;
  }
}

/** Media Queries
 */

 @media screen and (max-width: 800px) {
  form {
    width: 100%;
  }

  input[type=text],
  input[type=date],
  input[type=file],
  select,
  textarea {
  width: 95%;

  font-size: 18px;
}

input[type=text]:focus,
input[type=date]:focus,
input[type=file]:focus,
select:focus{
  font-size: 20px;
}

input[type=submit] {
  width: 60%;

  font-size: 18px;
}

input[type=submit]:hover {
  font-size: 20px;
}
}

@media screen and (max-width: 600px) {
  label {
    display: block;
    text-align: center;
    padding: 0;
  }
}
</style>