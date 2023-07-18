const express = require('express');
const { authenticate } = require('../services/token.js');

const router = express.Router();

// dict
router.get('/', authenticate, (req, res) => {
    console.log(req.user);
    res.render('feed', {
        user: req.user
    });
});

module.exports = router;
