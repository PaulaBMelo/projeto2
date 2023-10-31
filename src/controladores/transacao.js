const query = require("../bancodedados/conexao");

const listarTransacoes = async (req, res) => {
    const { usuario } = req;
    try {
        const transacoesEncontradas = await query('select * from transacoes where id = $1', [usuario.id]);

        return res.json(transacoesEncontradas.rows);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }
}

const detalharTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const { rows, rowCount } = await query('select * from transacoes where usuario_id = $1 and id =$2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não existe' });
        }

        const [transacao] = rows;

        return res.json(transacao);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }

}

const cadastrarTransacao = async (req, res) => {
    const { usuario } = req;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({ mensagem: 'Tipo informado inválido' });
    }

    try {

        const categoria = await query('select * from categorias where id = $1', [categoria_id]);
        if (categoria.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A categoria não existe' });
        }

        const queryCadastro = 'insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) values ($1, $2, $3, $4, $5, $6) returning *'
        const queryParams = [descricao, valor, data, categoria_id, tipo, usuario.id];
        const { rows, rowCount } = await query(queryCadastro, queryParams);

        if (rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const transacao = rows;
        return res.status(201).json(transacao);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro: ${error.mensage}` });
    }

}

const atualizarTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({ mensagem: 'Tipo informado inválido' });
    }

    try {
        const { rowCount } = await query('select * from transacoes where usuario_id = $1 and id =$2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não existe' });
        }

        const categoria = await query('select * from categorias where id = $1', [categoria_id]);

        if (categoria.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A categoria não existe' });
        }

        const queryAtualizar = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6';
        const queryParams = [descricao, valor, data, categoria_id, tipo, id];
        const transacao = await query(queryAtualizar, queryParams);

        if (transacao.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const excluirTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const transacao = await query('select * from transacoes where id = $1 and usuario_id = $2', [id, usuario.id]);

        if (transacao.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não existe' });
        }

        const transacaoExcluida = await query('delete from transacoes where id = $1 and usuario_id = $2', [id, usuario.id]);

        if (transacaoExcluida.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }

}

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao
}