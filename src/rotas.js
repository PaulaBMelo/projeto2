const express = require('express');
const listarCategorias = require('./controladores/categorias');
const { login } = require('./controladores/login');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao } = require('./controladores/transacao');
const { cadastrarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario');
const { filtrarAutenticacao } = require('./intermediarios/autenticacao');
const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(filtrarAutenticacao);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacoes', listarTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = {
    rotas
}