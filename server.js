const app = require('./config/express')();
const port = app.get('port');

// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA

// app.get('/', function (req, res)  {
//     res.send('sadasdas');
// });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});