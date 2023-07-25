const express = require('express');
const { generateAccessToken, authenticate } = require('../services/token.js');
const prisma = require('../services/prisma.js');

const router = express.Router();

router.get('/cadastro', authenticate, (req, res) => {
    res.render('cadastro');
});

router.post('/cadastro', async (req, res, next) => {
    try {
        await prisma.user.create({
            data: {
                email: req.body.email,
                username: req.body.username,
                senha: req.body.password,
                gender: req.body.genero,
                cargo: req.body.cargo,
                profilePicture: req.body.pfpPath,
            },
        });
    } catch (e) {
        return next(e);
    }

    res.redirect('/login');
});

router.post('/cadastro/upload-pfp', async (req, res, next) => {
    try {
        const hash = req.files.pfp.md5;
        const ext = req.files.pfp.name.split('.').pop();
        const url = `img/foto-perfil/${hash}.${ext}`;
        req.files.pfp.mv(`${__dirname}/../static/${url}`, (error) => {
            if (error)
                return res.status(500).json({ ok: false, error });

            res.json({ ok: true, url: '/' + url });
        });
    } catch(e) {
        return next(e);
    }
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

router.get('/perfil', authenticate, async (req, res) => {
    if (!req.user)
        return res.redirect('/login');

    const posts = await prisma.post.findMany({
        where: { user_id: req.user.id },
        orderBy: [{
            created_at: 'desc'
        }],
    })

    res.render('perfil', {
        user: req.user,
        posts
    });
});

router.get('/', authenticate, async (req, res) => {
    const posts = await prisma.post.findMany({
        orderBy: [{
            created_at: 'desc'
        }],
        include: {
            user: true,
        },
    });

    res.render('feed', {
        posts,
        user: req.user
    });
});

// usuario fazendo publicacaoes
router.post('/post', authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    await prisma.post.create({
        data: {
            user_id: req.user.id,
            content: req.body.content,
        },
    });

    res.json({ ok: true });
});

// usuario edita publicacao
router.patch('/post', authenticate, async (req, res) => {
    await prisma.post.update({
        data: {
            id: req.body.id,
            user_id: req.user.id,
            content: req.body.content,
            updated_at: req.body.atualizado,
            created_at: req.body.data,
        },
    });

    res.json({ ok: true });
});

router.get('/comments/:id', authenticate, async (req, res) => {
    const post_promise = prisma.post.findUnique({
        where: {
            id: parseInt(req.params.id),
        },
        include: {
            user: true,
        }
    });

    const comments_promise = prisma.comment.findMany({
        where: {
            post_id: parseInt(req.params.id),
        },
        include: {
            user: true,
        },
    });

    const [post, comments] = await Promise.all([post_promise, comments_promise]);

    res.render('comments', {
        user: req.user,
        post,
        comments,
    });
});

router.post('/comments/:id', authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    await prisma.comment.create({
        data: {
            user_id: req.user.id,
            post_id: parseInt(req.params.id),
            content: req.body.content,
        },
    });

    res.json({ ok: true });
});

// Adm apaga uma conta
router.delete('/account', authenticate, (req, res) => {
    user: req.admin
    delete id
    res.render('feed');
});

// usuario exclua uma publicação 
module.exports = router;
router.delete('/post/:id', authenticate, async (req, res) => {
    const postId = parseInt(req.params.id);

try {
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            user_id: req.user.id,
        },
    });

    if (!post) {
        return res.status(404).json({ error: "Publicação não encontrada ou você não tem permissão para excluí-la." });
    }


    await prisma.post.delete({
        where: {
            id: postId,
        },
    });

    res.json({ ok: true });
} catch (error) {
    return res.status(500).json({ error: "Ocorreu um erro ao excluir a publicação." });
}
});

// usuario altera a senha
router.post('/alterar-senha', authenticate, async (req, res) => {
    const userId = req.user.id;
    const { senhaAtual, novaSenha } = req.body;

    try {
        // Verifique se a senha atual fornecida corresponde à senha do usuário no banco de dados
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                senha: senhaAtual,
            },
        });

        if (!user) {
            return res.status(401).json({ error: "Senha atual incorreta" });
        }

        // Atualize a senha do usuário com a nova senha fornecida
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                senha: novaSenha,
            },
        });

        res.json({ ok: true });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao alterar a senha." });
    }
});

