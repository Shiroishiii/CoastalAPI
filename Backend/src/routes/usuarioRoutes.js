import { Router } from 'express'
import usuarioController from '../controller/usuarioController.js'


const usuarioRouter = Router()

usuarioRouter.get('/', usuarioController.getAll)

usuarioRouter.get('/:id', usuarioController.getById)

usuarioRouter.post('/', usuarioController.create)

usuarioRouter.put('/:id', usuarioController.update)

usuarioRouter.delete('/:id', usuarioController.remove)

export default usuarioRouter