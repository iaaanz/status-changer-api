const morgan = require('morgan');
const express = require('express');
const app = express();
const baseUrl = '/api/homolog';
const rotaHomolog = require('./api/routes/homolog');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); // apenas dados simples
app.use(express.json()); // json de entrada no body

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).send({});
  }

  return next();
});

app.use(baseUrl, rotaHomolog);

app.use((req, res, next) => {
  const error = new Error('Não encontrado');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  return res.json({
    erro: {
      message: error.message,
    },
  });
});

module.exports = app;
