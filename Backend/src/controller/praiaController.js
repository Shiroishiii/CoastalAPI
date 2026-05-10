import praiaService from '../service/praiaService.js'

const getAll = async (req, res) => {

    try {

        const praias =
            await praiaService.getAll()

        res.json(praias)

    } catch (error) {

        res.status(500).json({
            erro: error.message
        })
    }
}

const getById = async (req, res) => {

    try {

        const { id } = req.params

        const praia =
            await praiaService.getById(id)

        res.json(praia)

    } catch (error) {

        res.status(404).json({
            erro: error.message
        })
    }
}

const create = async (req, res) => {

    try {

        const {
            nome,
            regiao,
            descricao,
            nivel_perigo,
            surf
        } = req.body

        const praia =
            await praiaService.create(
                nome,
                regiao,
                descricao,
                nivel_perigo,
                surf
            )

        res.status(201).json(praia)

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

const update = async (req, res) => {

    try {

        const { id } = req.params

        const {
            nome,
            regiao,
            descricao,
            nivel_perigo,
            surf
        } = req.body

        const praia =
            await praiaService.update(
                id,
                nome,
                regiao,
                descricao,
                nivel_perigo,
                surf
            )

        res.json(praia)

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

const remove = async (req, res) => {

    try {

        const { id } = req.params

        await praiaService.remove(id)

        res.json({
            mensagem: 'Praia deletada com sucesso'
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