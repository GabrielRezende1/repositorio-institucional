<script>
//import { RouterLink } from 'vue-router';
export default {
  data() {
    return {
      productUnits: '',
      productImg: '',
      productDesc: '',
      productPrice: '',

      departmentName: '',
      departmentImage: ''
    }
  },

  methods: {
    getProductInfo() {

    }
  },

  components: {
    //RouterLink
}
}
</script>

<template>
  <div class="container">
    <nav class="departamentos-nav">
      <ul>
        <li class="subdepartamentos-nav"><a href="">CATEGORIAS</a></li>
        <li><a href="">HARDWARE</a></li>
        <li><a href="">PERIFÉRICOS</a></li>
        <li><a href="">FERRAMENTAS</a></li>
      </ul>
    </nav>

    <section class="produtos-vitrine flex">
      <div class="produtos-single">
        <span>{{ productUnits }} Un.</span>
        <img src="" alt="imagem do produto"/>
        <p>{{ productDesc }}descrição muito foda do produto parabéns é o máximo</p>
        <p>R${{ productPrice }}1.224,99</p>
        <button>COMPRAR</button>
      </div><!--produto-single-->

      <div class="produtos-single">
        <span>{{ productUnits }} Un.</span>
        <img src="" alt="imagem do produto"/>
        <p>{{ productDesc }}</p>
        <p>R${{ productPrice }}</p>
        <button>COMPRAR</button>
      </div><!--produto-single-->

      <div class="produtos-single">
        <span>{{ productUnits }} Un.</span>
        <img src="" alt="imagem do produto"/>
        <p>{{ productDesc }}</p>
        <p>R${{ productPrice }}</p>
        <button>COMPRAR</button>
      </div><!--produto-single-->

      <div class="produtos-single">
        <span>{{ productUnits }} Un.</span>
        <img src="" alt="imagem do produto"/>
        <p>{{ productDesc }}</p>
        <p>R${{ productPrice }}</p>
        <button>COMPRAR</button>
      </div><!--produto-single-->
    </section><!--produtos-vitrine flex-->

    <div class="divisao">
      <span>DEPARTAMENTOS</span>
    </div><!--divisao-->

    <section class="departamentos-section flex">
      <div class="departamentos-single">
        <img src="" alt="imagem do departamento">
        <h3>{{ departmentName }}</h3>
      </div><!--departamentos-single-->

      <div class="departamentos-single">
        <img src="" alt="imagem do departamento">
        <h3>{{ departmentName }}</h3>
      </div><!--departamentos-single-->

      <div class="departamentos-single">
        <img src="" alt="imagem do departamento">
        <h3>{{ departmentName }}</h3>
      </div><!--departamentos-single-->

      <div class="departamentos-single">
        <img src="" alt="imagem do departamento">
        <h3>{{ departmentName }}</h3>
      </div><!--departamentos-single-->

      <div class="departamentos-single">
        <img src="" alt="imagem do departamento">
        <h3>{{ departmentName }}</h3>
      </div><!--departamentos-single-->

      <div class="departamentos-single">
        <img src="" alt="imagem do departamento">
        <h3>{{ departmentName }}</h3>
      </div><!--departamentos-single-->
    </section><!--departamentos-section-->
  </div>
</template>

<style scoped>

.container {
  max-width: 1280px;
  margin: 0 auto;
}
/* nav */
nav.departamentos-nav {
  list-style-type: none;
  background-color: var(--yellow);
}

nav.departamentos-nav ul li {
  display: inline-block;
  padding: 0 1rem;
  font-size: 16px;
}

nav.departamentos-nav ul li.subdepartamentos-nav {
  background-color: #cfd64a;
}

nav ul li a {
  padding: 2px 0.5rem;
  font-weight: bold;
}

nav ul li a:hover {
  background-color: #cfd64a;
}
/** */

.flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  height: 100%; /* inherit from: container => header */
}

/* section produtos-vitrine */
.produtos-vitrine  > .produtos-single {
  width: 20%;
  margin: 2rem 1rem;
  background-color: white;
  color: var(--black);
}

.produtos-single > button {
  /* width: 80%; */
  padding: 2px 1rem;
  font-size: 20px;
  
  border-radius: 5px;
  border: 1px solid var(--black);
  background-color: var(--yellow);

  transition: 0.4s;
}

.produtos-single > button:hover {
  background-color: var(--blue);
  color: white;
}
/** */

div.divisao {
  margin: 3rem 1rem;
  border-bottom: 2px solid var(--black);
}

div.divisao span {
  font-size: 24px;
  font-weight: 600;
}

/* section departamentos-section */
.departamentos-section > .departamentos-single {
  width: 30%;
  margin: 2rem 1rem;
  background-color: white;
  color: var(--black);
}
/* */
</style>
