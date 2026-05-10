import pool from '../../db/connection.js'

const findAll = async () => {

    const result = await pool.query(
        `SELECT id, nome, regiao,
                descricao, nivel_perigo, surf
         FROM praia
         ORDER BY id`
    )

    return result.rows
}

const findById = async (id) => {

    const result = await pool.query(
        `SELECT id, nome, regiao,
                descricao, nivel_perigo, surf
         FROM praia
         WHERE id = $1`,
        [id]
    )

    return result.rows[0]
}

const create = async (
    nome,
    regiao,
    descricao,
    nivel_perigo,
    surf
) => {

    const result = await pool.query(
        `INSERT INTO praia
        (
            nome,
            regiao,
            descricao,
            nivel_perigo,
            surf
        )

        VALUES ($1, $2, $3, $4, $5)

        RETURNING
            id,
            nome,
            regiao,
            descricao,
            nivel_perigo,
            surf`,
        [
            nome,
            regiao,
            descricao,
            nivel_perigo,
            surf
        ]
    )

    return result.rows[0]
}

const update = async (
    id,
    nome,
    regiao,
    descricao,
    nivel_perigo,
    surf
) => {

    const result = await pool.query(
        `UPDATE praia
         SET nome = $1,
             regiao = $2,
             descricao = $3,
             nivel_perigo = $4,
             surf = $5

         WHERE id = $6

         RETURNING
            id,
            nome,
            regiao,
            descricao,
            nivel_perigo,
            surf`,
        [
            nome,
            regiao,
            descricao,
            nivel_perigo,
            surf,
            id
        ]
    )

    return result.rows[0]
}

const remove = async (id) => {

    await pool.query(
        `DELETE FROM praia
         WHERE id = $1`,
        [id]
    )
}

export default {
    findAll,
    findById,
    create,
    update,
    remove
}