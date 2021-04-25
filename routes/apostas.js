const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS AS APOSTAS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM apostas;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    apostas: result.map(n => {
                        return {
                            id_aposta: n.id_aposta,
                            numero: n.numero,
                            codigo: n.codigo,
                            id_sorteio: n.id_sorteio,
                            data_criado: n.data_criado,
                            nome: n.nome,
                            celular: n.celular,
                            data_pagamento: n.data_pagamento,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna uma aposta específico',
                                url: 'http://localhost:3000/apostas/' + n.id_aposta
                            }
                        }
                    })
                }
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({response})
            }
        )
    })
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO apostas (numero, codigo, id_sorteio, nome, celular) VALUES (?, ?, ?, ?, ?)',
            [req.body.numero, req.body.codigo, req.body.id_sorteio, req.body.nome, req.body.celular],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'Aposta inserida com sucesso',
                    numVencedorCriado: {
                        id_aposta: resultado.id_aposta,
                        numero: req.body.numero,
                        codigo: req.body.codigo,
                        id_sorteio: req.body.id_sorteio,
                        data_criado: req.body.data_criado,
                        nome: req.body.nome,
                        celular: req.body.celular,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todas as apostas',
                            url: 'http://localhost:3000/apostas'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UMA APOSTA ESPECIFICO
router.get('/:id_aposta', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM apostas WHERE id_aposta = ?;',
            [req.params.id_aposta],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado número vencedor com este ID'
                    })
                }
                const response = {
                    apostas: {
                        id_aposta: result[0].id_aposta,
                        nome: result[0].nome,
                        celular: result[0].celular,
                        numero: result[0].numero,
                        codigo: result[0].codigo,
                        id_sorteio: result[0].id_sorteio,
                        data_criado: result[0].data_criado,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um número vencedor especifíco',
                            url: 'http://localhost:3000/apostas'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
});

// ALTERA UM SORTEIOS
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE apostas
                SET data_pagamento = ?
            WHERE id_aposta = ?`,
            [
                req.body.data_pagamento,
                req.body.id_aposta
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Aposta atualizado com sucesso',
                    apostaAtualizada: {
                        id_aposta: resultado.id_aposta,
                        numero: req.body.numero,
                        codigo: req.body.codigo,
                        id_sorteio: req.body.id_sorteio,
                        data_criado: req.body.data_criado,
                        nome: req.body.nome,
                        celular: req.body.celular,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um sorteios específico',
                            url: 'http://localhost:3000/apostas/' + req.body.id_aposta
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

module.exports = router;