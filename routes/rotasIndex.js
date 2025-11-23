//var express = require('express');
//var router = express.Router();
//var controllerIndex = require('../controller/controllerIndex.js');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
//router.get('/', controllerIndex.index.tela_principal);
//module.exports = router;

// routes/rotasIndex.js

var express = require('express');
var router = express.Router();
// Caminho corrigido para o controllerIndex.js na raiz do projeto
const controller = require('../controllers/controllerIndex'); 

/* GET home page (Listagem). */
router.get('/', controller.index);

/* GET página Sobre. */
router.get('/sobre', controller.sobre);

/* GET/POST Criação de Receita. */
router.get('/nova', controller.novaReceitaForm);
router.post('/nova', controller.novaReceita);

/* GET/POST Alteração de Receita. */
router.get('/alterar/:id', controller.alterarReceitaForm);
router.post('/alterar/:id', controller.alterarReceita);

/* GET Consulta de Receita. */
router.get('/consultar/:id', controller.consultarReceita);

/* POST Exclusão de Receita. */
router.post('/excluir/:id', controller.excluirReceita);

/* GET Pesquisa de Receita. */
router.get('/pesquisar', controller.pesquisarReceita);

module.exports = router;