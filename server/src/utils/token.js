const jwt = require('jsonwebtoken');
const { jwt: config } = require('../config/env');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.secret, { expiresIn: config.expiresIn });

const verifyToken = (token) => jwt.verify(token, config.secret);

module.exports = { generateToken, verifyToken };
