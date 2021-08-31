const CryptoJS = require('crypto-js');

const mysql = require('../../mysql').pool;

module.exports = () => {
  const controller = {};

  controller.ListarExes = (req, res) => {
    mysql.getConnection((error, conn) => {
      if (error) throw error;

      conn.query('select * from user_data', (queryErr, result) => {
        conn.release();

        const response = {
          registros: result.length,
          exes: result.map((exe) => ({
            id_bd: exe.id_user,
            id_client: exe.id_client,
            token: exe.client_token,
            liberado: exe.liberado,
          })),
        };
        return res.status(200).send(response);
      });
    });
  };

  controller.CadastrarNovoExe = (req, res) => {
    const clientData = {
      id: req.params.id,
      liberado: req.params.liberado,
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

    return mysql.getConnection((error, conn) => {
      if (error) throw error; // not connected!

      conn.query(
        'insert into user_data (id_client, client_token, liberado) values (?, ?, ?);',
        [clientData.id, hashToken, clientData.liberado],
        (queryErr, result) => {
          conn.release(); // Libera a conexão

          if (queryErr) {
            return res.status(500).json({
              error: queryErr,
              response: null,
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
        }
      );
    });
  };

  controller.ConsultarExe = (req, res) => {
    const { id } = req.params;

    mysql.getConnection((error, conn) => {
      if (error) throw error; // not connected!

      conn.query(
        `select
          cli.id_client,
          cli.client_token,
          cli.liberado
            from user_data cli
              where cli.id_client = ?;`,
        [id],
        (queryErr, result) => {
          conn.release(); // Libera a conexão

          if (queryErr) {
            return res.status(500).json({
              error: queryErr,
              // response: null,
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
            message: 'Consulta realizada',
            data: {
              id: clientID,
              token: clientToken,
              liberado: clientliberado,
            },
          });
        }
      );
    });
  };

  controller.AtualizarExe = (req, res) => {
    const clientAtt = {
      pwd: req.params.pwd,
      id: req.params.id,
      status: req.params.status,
    };

    if (clientAtt.pwd !== process.env.INTERNAL_PWD) {
      return res.status(401).json({
        error: 'Não autorizado',
      });
    }

    return mysql.getConnection((error, conn) => {
      if (error) throw error;
      conn.query(
        'update user_data set liberado = ? where id_client = ?',
        [clientAtt.status, clientAtt.id],
        (queryErr, result) => {
          conn.release();

          if (queryErr) {
            return res.status(500).json({
              error: queryErr,
              response: null,
            });
          }

          return res.status(200).json({
            message: 'Atualizado com sucesso',
            data: `${result.affectedRows} record(s) updated`,
          });
        }
      );
    });
  };

  return controller;
};
