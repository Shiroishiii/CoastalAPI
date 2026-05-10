import express from "express"
import praiaRoutes from './routes/praiaRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import favoritoRoutes from './routes/favoritoRoute.js'
import avaliacaoRoutes from './routes/avaliacaoRoute.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Guia de Praias 🌊')
})

app.use('/praias', praiaRoutes)
app.use('/usuarios', usuarioRoutes)
app.use('/favoritos', favoritoRoutes)
app.use('/avaliacoes', avaliacaoRoutes)

export default app