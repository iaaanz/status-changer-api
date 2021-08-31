const express = require('express');

// Método antigo :p
//const exeController = require('../controllers/HomologController')();

// const {
//   ListarExes,
//   CadastrarNovoExe,
//   ConsultarExe,
//   AtualizaExe,
// } = require('../controllers/HomologControllerNew');

const {
  AtualizaExe,
  CadastrarNovoExe,
  ConsultarExe,
  ListarExes,
  GenAuthenticate,
} = require('../controllers/HomologControllerNew')();

const Authenticate = require('../middleware/auth');

const router = express.Router();

// Rota pra testar o authenticate
router.post('/authenticate', Authenticate);

// Rota pra gerar o auth
router.post('/gen-auth', GenAuthenticate);

router.use(Authenticate);

// router.get('/listar-exes', exeController.ListarExes);
// Reescrito porra !
router.get('/listar-exes', ListarExes);

// router.post('/cadastro-novo-exe/:id/:liberado', exeController.CadastrarNovoExe);
// Reescrito porra !
router.post('/cadastro-novo-exe/:id/:liberado', CadastrarNovoExe);

// router.get('/consulta-exe/:id', exeController.ConsultarExe);
// Reescrito porra !
router.get('/consulta-exe/:id', ConsultarExe);

// router.patch('/atualizar-exe/:pwd/:id/:status', exeController.AtualizarExe);
// Reescrito porra !
router.patch('/atualizar-exe/:pwd/:id/:status', AtualizaExe);

module.exports = router;
