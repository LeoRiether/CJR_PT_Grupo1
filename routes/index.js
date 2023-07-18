const express = require('express');
const { generateAccessToken, authenticate } = require('../services/token.js');
const prisma = require('../services/prisma.js');

const router = express.Router();

router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

router.post('/cadastro', async (req, res) => {
    await prisma.user.create({
        data: {
          email: req.body.email,
          username: req.body.username,
          senha: req.body.password,
          gender: req.body.genero,
          cargo: req.body.cargo,
        },
    });

    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res, next) => {
    // Verificar se existe um usuário com nome req.body.username e senha
    // req.body.password
    const user = await prisma.user.findFirst({
        where: {
            username: req.body.username,
            senha: req.body.password,
        }
    });

    if (!user)
        return res.render('login', { error: "Usuário ou senha inválidos" });

    const token = generateAccessToken(user.id);
    res.cookie("token", token);
    res.redirect('/perfil');
});

router.get('/recuperacao', (req, res) => {
    res.render('recuperacao');
});

router.get('/perfil', (req, res) => {
    res.render('perfil');
});

router.get('/', authenticate, (req, res) => {
    console.log(req.user);
    res.render('feed', {
        user: req.user
    });
});


module.exports = router; 




