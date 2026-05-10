import pool from '../../db/connection.js'

const create = async (
    usuario_id,
    praia_id
) => {

    const result = await pool.query(
        `INSERT INTO favorito
        (
            usuario_id,
            praia_id
        )

        VALUES ($1, $2)

        RETURNING *`,
        [
            usuario_id,
            praia_id
        ]
    )

    return result.rows[0]
}

const findByUsuario = async (usuario_id) => {

    const result = await pool.query(
        `SELECT
            praia.id,
            praia.nome,
            praia.regiao,
            praia.nivel_perigo

        FROM favorito

        JOIN praia
        ON praia.id = favorito.praia_id

        WHERE favorito.usuario_id = $1`,
        [usuario_id]
    )

    return result.rows
}

const remove = async (
    usuario_id,
    praia_id
) => {

    await pool.query(
        `DELETE FROM favorito
         WHERE usuario_id = $1
         AND praia_id = $2`,
        [
            usuario_id,
            praia_id
        ]
    )
}

export default {
    create,
    findByUsuario,
    remove
}