import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const { Pool } = pkg

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

console.log(process.env.DB_USER)

export default pool