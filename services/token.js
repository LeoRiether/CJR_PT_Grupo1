const jwt = require('jsonwebtoken');
const prisma = require('./prisma.js');

function generateAccessToken(id) {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
}

async function authenticate(req, res, next) {
    const token = req.cookies.token;
    console.log('[token]', token);

    try {
        const id = jwt.verify(token, process.env.TOKEN_SECRET).id;
        const user = await prisma.user.findUnique({
            where: { id },
        });
        req.user = user;
    } catch (e) {
        req.user = null;
    }
    next();
}

module.exports = { generateAccessToken, authenticate };
