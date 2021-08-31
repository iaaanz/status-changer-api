const mysql = require('../../mysql').pool;

module.exports = {
  ListarAdminUser: (name, callback) => {
    mysql.getConnection((error, conn) => {
      if (error) throw error;

      conn.query(
        'select user_name from users where user_name = ?',
        [name],
        (queryErr, result) => {
          conn.release();

          if (queryErr) {
            return callback(queryErr);
          }
          return callback(null, result);
        }
      );
    });
  },

  ListarExeService: (callback) => {
    mysql.getConnection((error, conn) => {
      if (error) throw error;

      conn.query('select * from user_data', (queryErr, result) => {
        conn.release();

        if (queryErr) {
          return callback(queryErr);
        }

        return callback(null, result);
      });
    });
  },

  CadastrarExeService: (clientData, hashToken, callback) => {
    mysql.getConnection((error, conn) => {
      if (error) throw error;

      conn.query(
        'insert into user_data (id_client, client_token, liberado) values (?, ?, ?);',
        [clientData.id, hashToken, clientData.liberado],
        (queryErr, result) => {
          conn.release();

          if (queryErr) {
            return callback(queryErr);
          }
          return callback(null, result);
        }
      );
    });
  },

  ConsultarExeService: (id, callback) => {
    mysql.getConnection((error, conn) => {
      if (error) throw error;

      conn.query(
        `select
          cli.id_client,
          cli.client_token,
          cli.liberado
            from user_data cli
              where cli.id_client = ?;`,
        [id],
        (queryErr, result) => {
          conn.release();

          if (queryErr) {
            return callback(queryErr);
          }

          return callback(null, result);
        }
      );
    });
  },

  AtualizaExeService: (clientData, callback) => {
    mysql.getConnection((error, conn) => {
      if (error) throw error;
      conn.query(
        'update user_data set liberado = ? where id_client = ?',
        [clientData.status, clientData.id],
        (queryErr, result) => {
          conn.release();

          if (queryErr) {
            return callback(queryErr);
          }

          return callback(null, result);
        }
      );
    });
  },
};
