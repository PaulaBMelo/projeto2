const { query } = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');

//SyntaxError: Unexpected token } in JSON at position 45

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
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }
}

//verificar no video se ele importou o intermediario pra cá.

const detalharUsuario = async (req, res) => {
    return res.status(200).json(req.usuario);
}


module.exports = {
    cadastrarUsuario,
    detalharUsuario
}