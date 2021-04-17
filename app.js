const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const bodyParser = require('body-parser')

const rotaApostas = require('./routes/apostas')
const rotaSorteios = require('./routes/sorteios')
const rotaUsuarios = require('./routes/usuarios');
const { use } = require('./routes/apostas');

//morgan - monitora todas as acoes mostrando no log
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
app.use(bodyParser.json()) //json de entrada no body

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    app.use(cors())
    next();
})

// ROTA
app.use('/apostas', rotaApostas)
app.use('/sorteios', rotaSorteios)
app.use('/usuarios', rotaUsuarios)

app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;