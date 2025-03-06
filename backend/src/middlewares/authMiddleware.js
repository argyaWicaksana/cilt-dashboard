const jwt = require('jsonwebtoken');
const response = require('../tools/response');

const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return response(req, res, {
      status: 401,
      message: 'Unauthorized - Token not provided'
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return response(req, res, {
        status: 401,
        message: 'Unauthorized - Invalid token'
      });
    }

    req.user = decoded;
    next();
  });
};

const authorizeUserLevels = (...userLevels) => (req, res, next) => {
  if (!req.user || !userLevels.includes(req.user.userLevel)) {
    return response(req, res, {
      status: 403,
      message: "Forbidden - You don't have permission"
    });
  }
  next();
}

module.exports = {
  verifyToken,
  authorizeUserLevels
};
