import favoritoRepository from '../repository/favoritoRepository.js'

const create = async (
    usuario_id,
    praia_id
) => {

    return await favoritoRepository.create(
        usuario_id,
        praia_id
    )
}

const getByUsuario = async (usuario_id) => {

    return await favoritoRepository.findByUsuario(
        usuario_id
    )
}

const remove = async (
    usuario_id,
    praia_id
) => {

    await favoritoRepository.remove(
        usuario_id,
        praia_id
    )
}

export default {
    create,
    getByUsuario,
    remove
}