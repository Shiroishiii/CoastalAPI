import avaliacaoService from '../service/avaliacaoService.js'

const create = async (req, res) => {

    try {

        const {
            nota,
            comentario,
            usuario_id,
            praia_id
        } = req.body

        const avaliacao =
            await avaliacaoService.create(
                nota,
                comentario,
                usuario_id,
                praia_id
            )

        res.status(201).json(avaliacao)

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

const getByPraia = async (req, res) => {

    try {

        const { id } = req.params

        const avaliacoes =
            await avaliacaoService.getByPraia(id)

        res.json(avaliacoes)

    } catch (error) {

        res.status(500).json({
            erro: error.message
        })
    }
}

const getByUsuario = async (req, res) => {

    try {

        const { id } = req.params

        const avaliacoes =
            await avaliacaoService.getByUsuario(id)

        res.json(avaliacoes)

    } catch (error) {

        res.status(500).json({
            erro: error.message
        })
    }
}

const update = async (req, res) => {

    try {

        const { id } = req.params

        const {
            nota,
            comentario
        } = req.body

        const avaliacao =
            await avaliacaoService.update(
                id,
                nota,
                comentario
            )

        res.json(avaliacao)

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

const remove = async (req, res) => {

    try {

        const { id } = req.params

        await avaliacaoService.remove(id)

        res.json({
            mensagem: 'Avaliação removida'
        })

    } catch (error) {

        res.status(404).json({
            erro: error.message
        })
    }
}

export default {
    create,
    getByPraia,
    getByUsuario,
    update,
    remove
}