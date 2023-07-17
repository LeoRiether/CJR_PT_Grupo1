const express = require('express');

const router = express.Router();

// dict
router.get('/', (req, res) => {
    res.render('feed', {
        nome: 'Leonardo'
    });
});

module.exports = router;
