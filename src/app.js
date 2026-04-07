import express from "express"
import praiaRoutes from './routes/praia.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'


const app = express()

app.use(express.json())
app.use(praiaRoutes)
app.use(usuarioRoutes)

export default app