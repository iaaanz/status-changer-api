module.exports = () => {
    const testeHomologDB = require('../data/testeHomolog.json');
    const controller = {};
  
    controller.listTestHomolog = (req, res) => res.status(200).send('aaaaaaaaaaaaa');
  
    return controller;
  }