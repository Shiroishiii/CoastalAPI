import usuarioService from '../service/usuarioService.js'

const getAll = async (req, res) => {

    try {

        const usuarios =
            await usuarioService.getAll()

        res.json(usuarios)

    } catch (error) {

        res.status(500).json({
            erro: error.message
        })
    }
}

const getById = async (req, res) => {

    try {

        const { id } = req.params

        const usuario =
            await usuarioService.getById(id)

        res.json(usuario)

    } catch (error) {

        res.status(404).json({
            erro: error.message
        })
    }
}

const create = async (req, res) => {

    try {

        const { nome, email, senha } = req.body

        const usuario =
            await usuarioService.create(
                nome,
                email,
                senha
            )

        res.status(201).json(usuario)

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

const update = async (req, res) => {

    try {

        const { id } = req.params

        const { nome, email, senha } = req.body

        const usuario =
            await usuarioService.update(
                id,
                nome,
                email,
                senha
            )

        res.json(usuario)

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

const remove = async (req, res) => {

    try {

        const { id } = req.params

        await usuarioService.remove(id)

        res.json({
            mensagem: 'Usuário deletado com sucesso'
        })

    } catch (error) {

        res.status(404).json({
            erro: error.message
        })
    }
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
}