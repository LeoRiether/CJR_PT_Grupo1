const jwt = require('jsonwebtoken');

function generateAccessToken(id) {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
}

module.exports = { generateAccessToken };
