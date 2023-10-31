const express = require('express');
const listarCategorias = require('./controladores/categorias');
const { login } = require('./controladores/login');
const { cadastrarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario');
const { filtrarAutenticacao } = require('./intermediarios/autenticacao');
const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(filtrarAutenticacao);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategorias);

module.exports = {
    rotas
}