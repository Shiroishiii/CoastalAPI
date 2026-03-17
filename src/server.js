import app from './app.js'

const PORT = 3000


app.get('/', (req, res) => {
    res.send('Bem-vindo')
})

//rotas

app.listen (PORT, () => {
    console.log (`API rodando na porta ${PORT}`)
})