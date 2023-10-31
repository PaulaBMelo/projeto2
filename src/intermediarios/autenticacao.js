const jwt = require('jsonwebtoken');
const { query } = require('../bancodedados/conexao');

const filtrarAutenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = await jwt.verify(token, 'senhaParaToken');

        const { rows, rowCount } = await query('select * from usuarios where id = $1', [id]);

        if (rowCount <= 0) {
            return res.status(401).json({ mensagem: 'Não autorizado' });
        }

        const usuarioEncontrado = rows;

        const { senha: _, ...dadosUsuario } = usuarioEncontrado;

        req.usuario = dadosUsuario;

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = {
    filtrarAutenticacao
}