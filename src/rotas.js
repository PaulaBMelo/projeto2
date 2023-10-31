const express = require('express');
const { login } = require('./controladores/login');
const { cadastrarUsuario } = require('./controladores/usuario');
const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

module.exports = {
    rotas
}