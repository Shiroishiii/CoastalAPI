import app from './app.js'

const PORT = 3000

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`)
})

console.log('ENV TEST:')
console.log('HOST:', process.env.DB_HOST)
console.log('USER:', process.env.DB_USER)
console.log('DB:', process.env.DB_NAME)