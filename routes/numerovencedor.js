const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM numerovencedor;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    numerovencedor: result.map(n => {
                        return {
                            id_numVencedor: n.id_numVencedor,
                            numero: n.numero,
                            id_numvencedor: n.id_numvencedor,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um número vencedor de um sorteio específico',
                                url: 'http://localhost:3000/numerovencedor/' + n.id_numvencedor
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
            'INSERT INTO numerovencedor (numero, id_numvencedor) VALUES (?, ?)',
            [req.body.numero, req.body.id_numvencedor],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'Número vencedor inserido com sucesso',
                    numVencedorCriado: {
                        id_numVencedor: resultado.id_numVencedor,
                        numero: req.body.numero,
                        id_numvencedor: req.body.id_numvencedor,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os números vencedores dos sorteios',
                            url: 'http://localhost:3000/numerovencedor'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UM NUMERO ESPECIFICO
router.get('/:id_numVencedor', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM numerovencedor WHERE id_numVencedor = ?;',
            [req.params.id_numVencedor],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado número vencedor com este ID'
                    })
                }

                const response = {
                    numerovencedor: {
                        id_numVencedor: result[0].id_numVencedor,
                        numero: result[0].numero,
                        id_numvencedor: result[0].id_numvencedor,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um número vencedor especifíco',
                            url: 'http://localhost:3000/numerovencedor'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
});

// ALTERA UM NUMERO VENCEDOR
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE numerovencedor
                SET id_sorteio = ?,
                    numero = ?
            WHERE id_numVencedor = ?`,
            [
                req.body.id_sorteio,
                req.body.numero,
                req.body.id_numVencedor
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Número vencedor atualizado com sucesso',
                    numVencedorAtualizado: {
                        id_numVencedor: req.body.id_numVencedor,
                        id_sorteio: req.body.id_sorteio,
                        numero: req.body.numero,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um número vencedor específico',
                            url: 'http://localhost:3000/numerovencedor/' + req.body.id_numVencedor
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// EXCLUI UM NUMERO VENCEDOR
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM numerovencedor WHERE id_numvencedor = ?`,
            [req.body.id_numvencedor],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Número vencedor removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Número vencedor',
                        url: 'http://localhost:3000/numerovencedor',
                        body: {
                            id_sorteio: 'String',
                            numero: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    });
});

module.exports = router;