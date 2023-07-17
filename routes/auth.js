const express = require('express');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



const router = express.Router();

router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});
router.post('/cadastro', async (req, res) => {
    const user = await prisma.user.create({
        data: {
          email: req.body.email,
          username: req.body.username,
          senha: req.body.password,
          gender: req.body.genero,
          cargo: req.body.cargo,
          },
        },
    )}
);
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




