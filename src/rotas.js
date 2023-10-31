const express = require('express');
const { login } = require('./controladores/login');
const { cadastrarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario');
const { filtrarAutenticacao } = require('./intermediarios/autenticacao');
const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(filtrarAutenticacao);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

module.exports = {
    rotas
}