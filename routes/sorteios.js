const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS SORTEIOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM sorteios;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    sorteios: result.map(s => {
                        return {
                            id_sorteio: s.id_sorteio,
                            cod_sorteio: s.cod_sorteio,
                            tamanho: s.tamanho,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um sorteio específico',
                                url: 'http://localhost:3000/sorteios/' + s.id_sorteio
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

// INSERE UM SORTEIOS
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO sorteios (cod_sorteio, tamanho, numero_vencedor, data_sorteio) VALUES (?,?,?,?)',
            [req.body.cod_sorteio, req.body.tamanho, req.body.numero_vencedor, req.data_sorteio],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'Sorteio inserido com sucesso',
                    sorteioCriado: {
                        id_sorteio: resultado.id_sorteio,
                        cod_sorteio: req.body.cod_sorteio,
                        tamanho: req.body.tamanho,
                        numero_vencedor: req.body.numero_vencedor,
                        data_sorteio: req.body.data_sorteio,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os sorteios',
                            url: 'http://localhost:3000/sorteios'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UM SORTEIOS ESPECIFICO
router.get('/:id_sorteio', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM sorteios WHERE id_sorteio = ?;',
            [req.params.id_sorteio],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado sorteios com este ID'
                    })
                }

                const response = {
                    
                    sorteios: {
                        id_sorteio: result[0].id_sorteio,
                        cod_sorteio: result[0].cod_sorteio,
                        tamanho: result[0].tamanho,
                        numero_vencedor: result[0].numero_vencedor,
                        data_sorteio: result[0].data_sorteio,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um sorteios',
                            url: 'http://localhost:3000/sorteios'
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
            `UPDATE sorteios
                SET cod_sorteio = ?,
                    tamanho = ?,
                    numero_vencedor = ?,
                    data_sorteio = ?
            WHERE id_sorteio = ?`,
            [
                req.body.cod_sorteio,
                req.body.tamanho,
                req.body.numero_vencedor,
                req.body.data_sorteio,
                req.body.id_sorteio
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Sorteio atualizado com sucesso',
                    sorteioAtualizado: {
                        id_sorteio: req.body.id_sorteio,
                        cod_sorteio: req.body.cod_sorteio,
                        tamanho: req.body.tamanho,
                        numero_vencedor: req.body.numero_vencedor,
                        data_sorteio: req.body.data_sorteio,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um sorteios específico',
                            url: 'http://localhost:3000/sorteios/' + req.body.id_sorteio
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// EXCLUI UM SORTEIOS
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM sorteios WHERE id_sorteio = ?`, [req.body.id_sorteio],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Sorteio removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um sorteios',
                        url: 'http://localhost:3000/sorteios',
                        body: {
                            cod_sorteio: 'String',
                            tamanho: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    });
});

module.exports = router;