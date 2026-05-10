import praiaRepository from '../repository/praiaRepository.js'

const getAll = async () => {

    return await praiaRepository.findAll()
}

const getById = async (id) => {

    const praia =
        await praiaRepository.findById(id)

    if (!praia) {
        throw new Error('Praia não encontrada')
    }

    return praia
}

const create = async (
    nome,
    regiao,
    descricao,
    nivel_perigo,
    surf
) => {

    return await praiaRepository.create(
        nome,
        regiao,
        descricao,
        nivel_perigo,
        surf
    )
}

const update = async (
    id,
    nome,
    regiao,
    descricao,
    nivel_perigo,
    surf
) => {

    const praiaExiste =
        await praiaRepository.findById(id)

    if (!praiaExiste) {
        throw new Error('Praia não encontrada')
    }

    return await praiaRepository.update(
        id,
        nome,
        regiao,
        descricao,
        nivel_perigo,
        surf
    )
}

const remove = async (id) => {

    const praiaExiste =
        await praiaRepository.findById(id)

    if (!praiaExiste) {
        throw new Error('Praia não encontrada')
    }

    await praiaRepository.remove(id)
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
}