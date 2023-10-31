const query = require("../bancodedados/conexao");

const listarCategorias = async (req, res) => {
    try {
        const { rows } = await query('select * from categorias');

        return res.json(rows);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }
}

module.exports = listarCategorias;