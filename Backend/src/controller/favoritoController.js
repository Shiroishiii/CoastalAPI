import favoritoService from '../service/favoritoService.js'

const create = async (req, res) => {

    try {

        const {
            usuario_id,
            praia_id
        } = req.body

        const favorito =
            await favoritoService.create(
                usuario_id,
                praia_id
            )

        res.status(201).json(favorito)

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

const getByUsuario = async (req, res) => {

    try {

        const { id } = req.params

        const favoritos =
            await favoritoService.getByUsuario(id)

        res.json(favoritos)

    } catch (error) {

        res.status(500).json({
            erro: error.message
        })
    }
}

const remove = async (req, res) => {

    try {

        const {
            usuario_id,
            praia_id
        } = req.body

        await favoritoService.remove(
            usuario_id,
            praia_id
        )

        res.json({
            mensagem: 'Favorito removido'
        })

    } catch (error) {

        res.status(400).json({
            erro: error.message
        })
    }
}

export default {
    create,
    getByUsuario,
    remove
}