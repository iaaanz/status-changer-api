const express = require('express');
//const bodyParser = require('body-parser');
const config = require('config');

module.exports = () => {
  const app = express();

  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || config.get('server.port'));

  // MIDDLEWARES
  app.use(express.json());

  require('../api/routes/testeHomolog')(app);
    
  return app;
};