const express = require('express');
const app = express();
const port = 3000;

// Set liquidjs as the default template engine
let { Liquid } = require('liquidjs');
app.engine('liquid', new Liquid().express()); 
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set liquid to default

// Static folder
app.use(express.static('static'));

app.get('/', (req, res) => {
    res.render('feed');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.get('/recuperacao', (req, res) => {
    res.render('recuperacao');
});

app.listen(port, () => {
  console.log(`CJRTwitter is listening on http://localhost:${port}`)
});
