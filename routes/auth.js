const express = require('express');

const router = express.Router();

router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

// TODO: rota de login

// TODO: rota de recuperação de senha

module.exports = router;
