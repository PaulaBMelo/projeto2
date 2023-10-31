const { query } = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const { query } = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    try {

        const { rows, rowCount } = await query('select * from usuarios where email = $1', [email]);

        if (rowCount <= 0) {
            return res.status(400).json({ mensagem: 'Usuário não encontrado' });
        }

        const usuario = rows;

        const compararSenha = await bcrypt.compare(senha, usuario.senha);

        if (!compararSenha) {
            return res.status(400).json({ mensagem: 'Email ou senha incorretos' });
        }

        const token = await jwt.sign({ id: usuario.id }, 'senhaParaToken', { expiresIn: '8h' });

        const { senha: _, dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        })


    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }
}

module.exports = {
    login
}