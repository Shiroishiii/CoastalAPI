import dotenv from 'dotenv'
dotenv.config({path: './.env'})
import express from "express"
import praiaRoutes from './routes/praia.routes.js'


const app = express()

app.use(express.json())
app.use(praiaRoutes)

export default app