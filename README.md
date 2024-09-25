# Repositório Institucional / Institucional Repository

:brazil: Aplicação Web de um repositório institucional da FAETERJ-Paracambi feito com MariaDB, Express, Vue.js e Node.js (Seria o MEVN Stack utilizando MariaDB ao invés de MongoDB).  
Este repositório foi usado como Trabalho de Conclusão de Curso de Sistemas de Informação da FAETERJ-Paracambi (09-07-2024).

___

:us: Web application of an institutional repository of FAETERJ-Paracambi made with MariaDB, Express, Vue.js and Node.js (It would be the MEVN Stack using MariaDB instead of MongoDB).  
This repository was used as the Final Project of the Information Systems Course at FAETERJ-Paracambi (09-07-2024).

## Instalação / Installation

Assim que o projeto estiver na sua primeira versão de lançamento, instruções serão adicionadas.

## Sobre / About

:brazil: O estado atual do projeto necessita de um banco de dados local configurado na máquina, o que dificulta sua utilização para testes. Já realizei alguns testes na nuvem utilizando AWS (EC2, RDS e S3) mas não quero arcar com os custos de consumo. Talvez eu faça uma fork do repositório onde reimplementarei o banco de dados com SQLite, que facilita os testes com um bando de dados embutido no navegador.

:us: The current state of the project requires a local database configured on the machine, which makes it difficult to use for testing. I have already performed some tests in the cloud using AWS (EC2, RDS and S3) but I don't want to bear the consumption costs. Maybe I will fork the repository where I will reimplement the database with SQLite, which makes testing easier with a database embedded in the browser.

# Estrutura / Structure

``` bash
├───root
    ├───backend
    │   ├───db
    │   │   ├───documents
    │   │   └───models
    │   └───express
    │       │───middlewares
    │       └───routes
    └───frontend
        ├───public
        └───src
            ├───assets
            ├───components
            │   └───icons
            ├───router
            └───views
```
