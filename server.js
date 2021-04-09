//cria um servico de http
const http = require('http');
// pega o app
const app = require('./app')
// define uma porta padrao
const port = process.env.PORT || 3000;
// cria nosso server, passando o app dentro do server
const server = http.createServer(app);
// escuta ele na porta
server.listen(port);



