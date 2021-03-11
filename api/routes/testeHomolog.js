module.exports = app => {
    const controller = require('../controllers/testeHomolog')();
  
    app.route('/api/v1/teste-homolog')
      .get(controller.listTestHomolog);

    app.route('/teste')
      .get(controller.listTestHomolog)
      
  }