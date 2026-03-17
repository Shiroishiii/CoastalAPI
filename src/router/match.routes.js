import express, { Router } from "express"

Router.get('/', (req, res) => {
    res.json({ message: 'API Rodando'})
})

export default Router