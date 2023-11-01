const { query } = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {

        const verificarEmailExistente = await query('select * from usuarios where email = $1', [email]);

        if (verificarEmailExistente.rowCount > 0) {
            return res.status(400).json({ mensagem: 'O email já existe em cadastro' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastro = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *';
        const queryParams = [nome, email, senhaCriptografada];
        const usuarioCadastrado = await query(queryCadastro, queryParams);

        if (usuarioCadastrado.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
        }

        const { senha: _, ...cadastro } = usuarioCadastrado.rows[0];

        return res.status(201).json(cadastro);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error}` });
    }
}

const detalharUsuario = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarUsuario = async (req, res) => {
    const { usuario } = req;

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {

        const usuarioEncontrado = await query('select * from usuarios where email = $1', [email]);

        if (usuarioEncontrado.rowCount > 0 && usuarioEncontrado.rows[0].id !== usuario.id) {
            return res.status(400).json({ mensagem: 'O email já existe em cadastro' });
        }

        const senhaNova = await bcrypt.hash(senha, 10);

        const queryAtualizacao = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4';
        const queryParams = [nome, email, senhaNova, usuario.id];
        const atualizacao = await query(queryAtualizacao, queryParams);

        if (atualizacao.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const { senha: _, ...cadastro } = atualizacao.rows[0];

        return res.status(204).send(cadastro);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }
}


module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}