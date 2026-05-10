import { Router } from 'express'

import avaliacaoController from '../controller/avaliacaoController.js'

const avaliacaoRouter = Router()

avaliacaoRouter.post('/', avaliacaoController.create)

avaliacaoRouter.get('/praia/:id',
    avaliacaoController.getByPraia)

avaliacaoRouter.get('/usuario/:id',
    avaliacaoController.getByUsuario)

avaliacaoRouter.put('/:id',
    avaliacaoController.update)

avaliacaoRouter.delete('/:id',
    avaliacaoController.remove)

export default avaliacaoRouter