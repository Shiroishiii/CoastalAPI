import pool from '../../db/connection.js'

const create = async (
    nota,
    comentario,
    usuario_id,
    praia_id
) => {

    const result = await pool.query(
        `INSERT INTO avaliacao
        (
            nota,
            comentario,
            usuario_id,
            praia_id
        )

        VALUES ($1, $2, $3, $4)

        RETURNING *`,
        [
            nota,
            comentario,
            usuario_id,
            praia_id
        ]
    )

    return result.rows[0]
}

const findByPraia = async (praia_id) => {

    const result = await pool.query(
        `SELECT
            avaliacao.id,
            avaliacao.nota,
            avaliacao.comentario,
            usuario.nome AS usuario

        FROM avaliacao

        JOIN usuario
        ON usuario.id = avaliacao.usuario_id

        WHERE praia_id = $1`,
        [praia_id]
    )

    return result.rows
}

const findByUsuario = async (usuario_id) => {

    const result = await pool.query(
        `SELECT
            avaliacao.id,
            avaliacao.nota,
            avaliacao.comentario,
            praia.nome AS praia

        FROM avaliacao

        JOIN praia
        ON praia.id = avaliacao.praia_id

        WHERE usuario_id = $1`,
        [usuario_id]
    )

    return result.rows
}

const update = async (
    id,
    nota,
    comentario
) => {

    const result = await pool.query(
        `UPDATE avaliacao
         SET nota = $1,
             comentario = $2

         WHERE id = $3

         RETURNING *`,
        [
            nota,
            comentario,
            id
        ]
    )

    return result.rows[0]
}

const remove = async (id) => {

    await pool.query(
        `DELETE FROM avaliacao
         WHERE id = $1`,
        [id]
    )
}

export default {
    create,
    findByPraia,
    findByUsuario,
    update,
    remove
}