const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS USUARIOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios;',
            (error, result, fields) => {
                const response = {
                    quantidade: result.length,
                    usuarios: result.map(u => {
                        return {
                            id_usuario: u.id_usuario,
                            email: u.email,
                            fone: u.fone,
                            senha: u.senha,
                            permissao: u.permissao,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um sorteio específico',
                                url: 'http://localhost:3000/usuarios/' + u.id_usuario
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

// INSERE UM USUARIOS
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO usuarios (email, fone, senha, permissao) VALUES (?,?,?,?)',
            [req.body.email, req.body.fone, req.body.senha, req.body.permissao],
            (error, resultado, field) => {
                //para liberar a conexao, se nao ela vai continuar na fila e travar outros acessos
                conn.release();
                
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: 'Usuários inserido com sucesso',
                    sorteioCriado: {
                        id_usuario: resultado.id_usuario,
                        email: req.body.email,
                        fone: req.body.fone,
                        senha: req.body.senha,
                        permissao: req.body.permissao,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os usuarios',
                            url: 'http://localhost:3000/usuarios'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// RETORNA UM USUARIOS ESPECIFICO
router.get('/:id_usuario', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?;',
            [req.params.id_usuario],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado usuarios com este ID'
                    })
                }

                const response = {
                    
                    usuarios: {
                        id_usuario: result[0].id_usuario,
                        email: result[0].email,
                        fone: result[0].fone,
                        senha: result[0].senha,
                        permissao: result[0].permissao,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna um usuarios',
                            url: 'http://localhost:3000/usuarios'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
});

// ALTERA UM USUARIOS
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE usuarios
                SET email     = ?,
                    fone    = ?,
                    senha = ?,
                    permissao = ?
            WHERE id_usuario = ?`,
            [req.body.email, req.body.fone, req.body.senha, req.body.permissao, req.body.id_usuario],
            
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Sorteio atualizado com sucesso',
                    sorteioAtualizado: {
                        id_usuario: req.body.id_usuario,
                        email: req.body.email,
                        fone: req.body.fone,
                        senha: req.body.senha,
                        permissao: req.body.permissao,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um usuario específico',
                            url: 'http://localhost:3000/usuarios/' + req.body.id_usuario
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
    });
});

// EXCLUI UM USUARIOS
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM usuarios WHERE id_usuario = ?`, [req.body.id_usuario],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Usuário removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um usuarios',
                        url: 'http://localhost:3000/usuarios',
                        body: {
                            email: 'String',
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