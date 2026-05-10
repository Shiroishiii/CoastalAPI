import avaliacaoRepository from '../repository/avaliacaoRepository.js'

const create = async (
    nota,
    comentario,
    usuario_id,
    praia_id
) => {

    return await avaliacaoRepository.create(
        nota,
        comentario,
        usuario_id,
        praia_id
    )
}

const getByPraia = async (praia_id) => {

    return await avaliacaoRepository.findByPraia(
        praia_id
    )
}

const getByUsuario = async (usuario_id) => {

    return await avaliacaoRepository.findByUsuario(
        usuario_id
    )
}

const update = async (
    id,
    nota,
    comentario
) => {

    return await avaliacaoRepository.update(
        id,
        nota,
        comentario
    )
}

const remove = async (id) => {

    await avaliacaoRepository.remove(id)
}

export default {
    create,
    getByPraia,
    getByUsuario,
    update,
    remove
}