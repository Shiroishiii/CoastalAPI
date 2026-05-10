import { Router } from 'express'

import favoritoController from '../controller/favoritoController.js'

const favoritoRouter = Router()

favoritoRouter.post('/',
    favoritoController.create)

favoritoRouter.get('/usuario/:id',
    favoritoController.getByUsuario)

favoritoRouter.delete('/',
    favoritoController.remove)

export default favoritoRouter