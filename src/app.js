import express from "express"

const app = express()

app.use(express.json())

app.use('/matches', matchRoutes)

export default app