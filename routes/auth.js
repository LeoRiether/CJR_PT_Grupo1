const express = require('express');

const router = express.Router();

router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

// TODO: rota de login
router.get('/login', (req, res) => {
    res.render('login');
});


// TODO: rota de recuperação de senha



router.get('/recuperacao', (req, res) => {
    res.render('recuperacao');
});


// TODO: rota de perfil


router.get('/perfil', (req, res) => {
    res.render('perfil');
});
module.exports = router; 


// TODO: rota de logado feed
router.get('/logfeed', (req, res) => {
    res.render('logfeed');
});

