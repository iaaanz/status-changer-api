const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'No token provided',
    });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).json({
      error: 'Token error',
    });
  }

  const [scheme, token] = parts;

  console.log(parts);

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      error: 'Token poorly formatted',
    });
  }

  jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'Token invalid',
      });
    }

    console.log(decoded);
    return next();
  });
};
