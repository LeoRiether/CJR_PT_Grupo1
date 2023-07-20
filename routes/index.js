const express = require('express');
const { generateAccessToken, authenticate } = require('../services/token.js');
const prisma = require('../services/prisma.js');
const res = require('express/lib/response.js');

const router = express.Router();

router.get('/cadastro', authenticate, (req, res) => {
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

router.get('/login', authenticate, (req, res) => {
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

router.get('/recuperacao', authenticate, (req, res) => {
    res.render('recuperacao');
});

router.get('/perfil', authenticate, (req, res) => {
    res.render('perfil');
});

router.get('/', authenticate, (req, res) => {
    res.render('feed', {
        user: req.user
    });
});


userRouter .delete("/user/id:", JwGuard, async (req, res) => {
    const user = req.user
    if (req.user.id !== +redirect.params.id)
        return res
        .status(403)
        .json({ message: "Você não tem permissão para deletar este usuário"})
    const { id } = req.params;
    try {
        const usuarioDeletado = await userService.delete(+id);
        res.status(200).json(usuarioDeletado);
    }
    catch (err) {
        res.status(400).json(( erro: err.message));
    }
});

export default userRouter;


module.exports = router; 

// usuario fazendo publicacaoes
router.post('/perfil', async (req, res) => {
    await prisma.post.create({
        data: {
            user_id: req.body.userid,  
            content:  req.body.content,   
            updated_at: req.body.atualizado,  
            created_at: req.body.data,    
          
        },
    });

    res.redirect('/feed');
});
// usuario edita publicacao
router.patch('/perfil', async (req, res) => {
    await prisma.post.updated_at({
        data: {
            user_id: req.body.userid,  
            content:  req.body.content,   
            updated_at: req.body.atualizado,  
            created_at: req.body.data,  
          
        },
    });

    res.redirect('/feed');
});


