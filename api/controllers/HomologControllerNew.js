const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {
  ListarExeService,
  CadastrarExeService,
  ConsultarExeService,
  AtualizaExeService,
  ListarAdminUser,
} = require('../services/homolog.service');

module.exports = () => {
  const controller = {};

  controller.generateToken = (params = {}) => {
    return jwt.sign(params, process.env.AUTH_TOKEN, {
      expiresIn: 3600,
    });
  };

  controller.GenAuthenticate = (req, res) => {
    const { name } = req.body;
    ListarAdminUser(name, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database connection error',
          error: err,
        });
      }

      if (!result[0]) {
        return res.status(400).json({
          success: 0,
          message: 'User not found',
        });
      }

      let user_name = result[0].user_name;
      return res.status(200).json({
        success: 1,
        data: {
          name,
          token: controller.generateToken({ name: user_name }),
        },
      });
    });
  };

  controller.ListarExes = (req, res) => {
    ListarExeService((err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database connection error',
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  };

  controller.CadastrarNovoExe = (req, res) => {
    const body = req.params;

    const clientData = {
      id: body.id,
      liberado: body.liberado,
    };

    const validParams = ['S', 'N'];

    const hashToken = CryptoJS.HmacSHA256(
      clientData.id,
      'key de alteracao hehe'
    ).toString();

    if (!validParams.includes(clientData.liberado)) {
      return res.status(400).json({
        error: `Parâmetros incorretos '${clientData.liberado}'`,
      });
    }

    return CadastrarExeService(clientData, hashToken, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      return res.status(201).json({
        message: 'Inserido com sucesso',
        data: {
          id: clientData.id,
          token: clientData.token,
          liberado: clientData.liberado,
        },
        result: result,
      });
    });
  };

  controller.ConsultarExe = (req, res) => {
    const body = req.params;
    const { id } = body;

    ConsultarExeService(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      if (!result[0]) {
        return res.status(500).json({
          message: 'Não encontrado nenhum registro com esses parâmetros',
          data: {},
        });
      }

      const clientToken = result[0].client_token;
      const clientID = result[0].id_client;
      const clientliberado = result[0].liberado;

      return res.status(200).json({
        message: 'Success',
        data: {
          id: clientID,
          token: clientToken,
          liberado: clientliberado,
        },
      });
    });
  };

  controller.AtualizaExe = (req, res) => {
    const clientData = {
      pwd: req.params.pwd,
      id: req.params.id,
      status: req.params.status,
    };

    if (clientData.pwd !== process.env.INTERNAL_PWD) {
      return res.status(401).json({
        error: 'Não autorizado',
      });
    }

    AtualizaExeService(clientData, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      return res.status(200).json({
        message: 'Atualizado com sucesso',
        data: `${result.affectedRows} record(s) updated`,
      });
    });
  };

  return controller;
};
