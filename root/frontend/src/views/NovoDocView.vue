<script>
import MenuBar from '@/components/MenuBar.vue'
import axios from 'axios'
export default {
    data() {
        return {
            info: {},
            info2: {},
            
            file: null,
            validFile: false,
            //Doc table columns
            nome_doc: '',
            nome_arq: '',
            resumo: '',
            data: '',
            docente: '',
            tipo: '', //doc column "tipo"
            palavraChave: ''
        }
    },

    components: { MenuBar },

    methods: {
        readFile() {
            this.file = this.$refs.file.files[0];
            if (this.file.name.includes('.pdf')) {
                this.nome_arq = this.file.name;
                this.validFile = true;
            }else {
                this.validFile = false;
            }
        },

        postNovoDoc() {
            if (!this.validFile) {
                return;
            }

            const form = new FormData();
            form.append('arquivo', new Blob([this.file], {type: 'application/pdf'}), this.nome_arq);
            form.append('titulo', this.nome_doc);
            form.append('resumo', this.resumo);
            form.append('data', this.data);
            form.append('tipo', this.tipo);
            form.append('orientador', this.docente);
            form.append('palavraChave', this.palavraChave);

            axios.post('http://localhost:3000/api/minha-conta/novo-documento',
            form)
            .then(res => {
                this.info2 = res.data;
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
            .get('http://localhost:3000/api/minha-conta/novo-documento')
            .then((res) => {
                console.log(res.data);
                this.info = res.data;
            })
            .catch(err => {
                console.log(err.response.data);
                this.$router.push('/');
            })
    },

    mounted() {
        //Set max date to today
        const date = document.getElementById('data');
        //Get correct YYYY-MM-DD format used in html date tag
        date.max = new Date().toISOString().split("T")[0];
    }
}
</script>

<template>
    <section>
        <MenuBar />
        <!--student form-->
        <form action="" method="post" id="form" @submit.prevent="postNovoDoc" enctype="multipart/form-data">
            <label for="nome_doc">Título do Trabalho:</label>
            <input type="text" id="nome_doc" v-model="nome_doc" />
            <label for="arquivo">Arquivo:</label>
            <input type="file" id="arquivo" accept=".pdf" ref="file" @change="readFile" />
            <label for="resumo">Resumo:</label>
            <textarea id="resumo" v-model="resumo"></textarea>
            <label for="data">Data:</label>
            <input type="date" id="data" min="01-01-2002" v-model="data" />
            <label for="doc_tipo">Tipo de Documento:</label>
            <select name="doc_tipo" id="doc_tipo" v-model="tipo">
                <!--value attr is id_doc_tipo-->
                <option value="Artigo de Evento">Artigo de Evento</option>
                <option value="Artigo de Periódico">Artigo de Periódico</option>
                <option value="Capítulo de Livro">Capítulo de Livro</option>
                <option value="Dissertação">Dissertação</option>
                <option value="Livro">Livro</option>
                <option value="Monografia">Monografia</option>
                <option value="Tese">Tese</option>
                <option value="Trabalho de Conclusão de Curso">Trabalho de Conclusão de Curso</option>
            </select>
            <label for="palavraChave">Palavras-Chave:</label>
            <input type="text" id="palavraChave" v-model="palavraChave" />
            <!--If user is Student, create drop down list of teachers-->
            <label v-if="info.isStudent" for="docente">Orientador:</label>
            <select v-if="info.isStudent" name="docente" id="docente" v-model="docente">
                <option v-for="teacher in info.teachers" :key="teacher" :value="teacher.nome">
                    {{ teacher.nome }}
                </option>
            </select>
            <input type="submit" value="Criar documento">
        </form>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    margin: 2rem 0;
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

  transition: 0.4s;
}

textarea {
  height: 200px;

  resize: none;
  padding: 0.5rem 1rem;
}

input[type=text]:focus,
select:focus,
textarea:focus {
  font-size: 22px;
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
</style>