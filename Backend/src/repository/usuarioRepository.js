import pool from '../../db/connection.js'

const findAll = async () => {

    const result = await pool.query(
        `SELECT id, nome, email
         FROM usuario
         ORDER BY id`
    )

    return result.rows
}

const findById = async (id) => {

    const result = await pool.query(
        `SELECT id, nome, email
         FROM usuario
         WHERE id = $1`,
        [id]
    )

    return result.rows[0]
}

const findByEmail = async (email) => {

    const result = await pool.query(
        `SELECT *
         FROM usuario
         WHERE email = $1`,
        [email]
    )

    return result.rows[0]
}

const create = async (nome, email, senha) => {

    const result = await pool.query(
        `INSERT INTO usuario (nome, email, senha)
         VALUES ($1, $2, $3)
         RETURNING id, nome, email`,
        [nome, email, senha]
    )

    return result.rows[0]
}

const update = async (id, nome, email, senha) => {

    const result = await pool.query(
        `UPDATE usuario
         SET nome = $1,
             email = $2,
             senha = $3
         WHERE id = $4
         RETURNING id, nome, email`,
        [nome, email, senha, id]
    )

    return result.rows[0]
}

const remove = async (id) => {

    await pool.query(
        `DELETE FROM usuario
         WHERE id = $1`,
        [id]
    )
}

export default {
    findAll,
    findById,
    findByEmail,
    create,
    update,
    remove
}