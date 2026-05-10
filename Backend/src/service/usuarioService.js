import usuarioRepository from '../repository/usuarioRepository.js'

const getAll = async () => {

    return await usuarioRepository.findAll()
}

const getById = async (id) => {

    const usuario =
        await usuarioRepository.findById(id)

    if (!usuario) {
        throw new Error('Usuário não encontrado')
    }

    return usuario
}

const create = async (nome, email, senha) => {

    const usuarioExiste =
        await usuarioRepository.findByEmail(email)

    if (usuarioExiste) {
        throw new Error('Email já cadastrado')
    }

    return await usuarioRepository.create(
        nome,
        email,
        senha
    )
}

const update = async (id, nome, email, senha) => {

    const usuarioExiste =
        await usuarioRepository.findById(id)

    if (!usuarioExiste) {
        throw new Error('Usuário não encontrado')
    }

    return await usuarioRepository.update(
        id,
        nome,
        email,
        senha
    )
}

const remove = async (id) => {

    const usuarioExiste =
        await usuarioRepository.findById(id)

    if (!usuarioExiste) {
        throw new Error('Usuário não encontrado')
    }

    await usuarioRepository.remove(id)
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
}