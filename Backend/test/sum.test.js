import { jest } from '@jest/globals'
import request from 'supertest'

const praiaServiceMock = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}

const usuarioServiceMock = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}

const favoritoServiceMock = {
    create: jest.fn(),
    getByUsuario: jest.fn(),
    remove: jest.fn()
}

const avaliacaoServiceMock = {
    create: jest.fn(),
    getByPraia: jest.fn(),
    getByUsuario: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}

await jest.unstable_mockModule('../src/service/praiaService.js', () => ({
    default: praiaServiceMock
}))

await jest.unstable_mockModule('../src/service/usuarioService.js', () => ({
    default: usuarioServiceMock
}))

await jest.unstable_mockModule('../src/service/favoritoService.js', () => ({
    default: favoritoServiceMock
}))

await jest.unstable_mockModule('../src/service/avaliacaoService.js', () => ({
    default: avaliacaoServiceMock
}))

const { default: app } = await import('../src/app.js')

describe('Rotas da API Guia de Praias', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Praias', () => {
        test('GET /praias', async () => {
            praiaServiceMock.getAll.mockResolvedValue([{ id: 1, nome: 'Praia A' }])

            const response = await request(app).get('/praias')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual([{ id: 1, nome: 'Praia A' }])
            expect(praiaServiceMock.getAll).toHaveBeenCalledTimes(1)
        })

        test('GET /praias/:id', async () => {
            praiaServiceMock.getById.mockResolvedValue({ id: 10, nome: 'Praia B' })

            const response = await request(app).get('/praias/10')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ id: 10, nome: 'Praia B' })
            expect(praiaServiceMock.getById).toHaveBeenCalledWith('10')
        })

        test('POST /praias', async () => {
            const payload = {
                nome: 'Praia Nova',
                regiao: 'Sul',
                descricao: 'Teste',
                nivel_perigo: 'Verde',
                surf: true
            }

            praiaServiceMock.create.mockResolvedValue({ id: 2, ...payload })

            const response = await request(app).post('/praias').send(payload)

            expect(response.statusCode).toBe(201)
            expect(response.body).toEqual({ id: 2, ...payload })
            expect(praiaServiceMock.create).toHaveBeenCalledWith(
                payload.nome,
                payload.regiao,
                payload.descricao,
                payload.nivel_perigo,
                payload.surf
            )
        })

        test('PUT /praias/:id', async () => {
            const payload = {
                nome: 'Praia Atualizada',
                regiao: 'Norte',
                descricao: 'Atualizada',
                nivel_perigo: 'Amarela',
                surf: false
            }

            praiaServiceMock.update.mockResolvedValue({ id: 2, ...payload })

            const response = await request(app).put('/praias/2').send(payload)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ id: 2, ...payload })
            expect(praiaServiceMock.update).toHaveBeenCalledWith(
                '2',
                payload.nome,
                payload.regiao,
                payload.descricao,
                payload.nivel_perigo,
                payload.surf
            )
        })

        test('DELETE /praias/:id', async () => {
            praiaServiceMock.remove.mockResolvedValue()

            const response = await request(app).delete('/praias/2')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ mensagem: 'Praia deletada com sucesso' })
            expect(praiaServiceMock.remove).toHaveBeenCalledWith('2')
        })
    })

    describe('Usuarios', () => {
        test('GET /usuarios', async () => {
            usuarioServiceMock.getAll.mockResolvedValue([{ id: 1, nome: 'Isaac' }])

            const response = await request(app).get('/usuarios')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual([{ id: 1, nome: 'Isaac' }])
            expect(usuarioServiceMock.getAll).toHaveBeenCalledTimes(1)
        })

        test('GET /usuarios/:id', async () => {
            usuarioServiceMock.getById.mockResolvedValue({ id: 1, nome: 'Isaac' })

            const response = await request(app).get('/usuarios/1')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ id: 1, nome: 'Isaac' })
            expect(usuarioServiceMock.getById).toHaveBeenCalledWith('1')
        })

        test('POST /usuarios', async () => {
            const payload = { nome: 'Isaac', email: 'isaac@test.com', senha: '123456' }
            usuarioServiceMock.create.mockResolvedValue({ id: 1, ...payload })

            const response = await request(app).post('/usuarios').send(payload)

            expect(response.statusCode).toBe(201)
            expect(response.body).toEqual({ id: 1, ...payload })
            expect(usuarioServiceMock.create).toHaveBeenCalledWith(
                payload.nome,
                payload.email,
                payload.senha
            )
        })

        test('PUT /usuarios/:id', async () => {
            const payload = { nome: 'Isaac 2', email: 'isaac2@test.com', senha: '654321' }
            usuarioServiceMock.update.mockResolvedValue({ id: 1, ...payload })

            const response = await request(app).put('/usuarios/1').send(payload)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ id: 1, ...payload })
            expect(usuarioServiceMock.update).toHaveBeenCalledWith(
                '1',
                payload.nome,
                payload.email,
                payload.senha
            )
        })

        test('DELETE /usuarios/:id', async () => {
            usuarioServiceMock.remove.mockResolvedValue()

            const response = await request(app).delete('/usuarios/1')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ mensagem: 'Usuário deletado com sucesso' })
            expect(usuarioServiceMock.remove).toHaveBeenCalledWith('1')
        })
    })

    describe('Favoritos', () => {
        test('POST /favoritos', async () => {
            const payload = { usuario_id: 1, praia_id: 2 }
            favoritoServiceMock.create.mockResolvedValue({ id: 99, ...payload })

            const response = await request(app).post('/favoritos').send(payload)

            expect(response.statusCode).toBe(201)
            expect(response.body).toEqual({ id: 99, ...payload })
            expect(favoritoServiceMock.create).toHaveBeenCalledWith(
                payload.usuario_id,
                payload.praia_id
            )
        })

        test('GET /favoritos/usuario/:id', async () => {
            favoritoServiceMock.getByUsuario.mockResolvedValue([{ id: 1, praia_id: 2 }])

            const response = await request(app).get('/favoritos/usuario/1')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual([{ id: 1, praia_id: 2 }])
            expect(favoritoServiceMock.getByUsuario).toHaveBeenCalledWith('1')
        })

        test('DELETE /favoritos', async () => {
            const payload = { usuario_id: 1, praia_id: 2 }
            favoritoServiceMock.remove.mockResolvedValue()

            const response = await request(app).delete('/favoritos').send(payload)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ mensagem: 'Favorito removido' })
            expect(favoritoServiceMock.remove).toHaveBeenCalledWith(
                payload.usuario_id,
                payload.praia_id
            )
        })
    })

    describe('Avaliacoes', () => {
        test('POST /avaliacoes', async () => {
            const payload = { nota: 5, comentario: 'Top', usuario_id: 1, praia_id: 2 }
            avaliacaoServiceMock.create.mockResolvedValue({ id: 7, ...payload })

            const response = await request(app).post('/avaliacoes').send(payload)

            expect(response.statusCode).toBe(201)
            expect(response.body).toEqual({ id: 7, ...payload })
            expect(avaliacaoServiceMock.create).toHaveBeenCalledWith(
                payload.nota,
                payload.comentario,
                payload.usuario_id,
                payload.praia_id
            )
        })

        test('GET /avaliacoes/praia/:id', async () => {
            avaliacaoServiceMock.getByPraia.mockResolvedValue([{ id: 10, nota: 4 }])

            const response = await request(app).get('/avaliacoes/praia/2')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual([{ id: 10, nota: 4 }])
            expect(avaliacaoServiceMock.getByPraia).toHaveBeenCalledWith('2')
        })

        test('GET /avaliacoes/usuario/:id', async () => {
            avaliacaoServiceMock.getByUsuario.mockResolvedValue([{ id: 10, nota: 4 }])

            const response = await request(app).get('/avaliacoes/usuario/1')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual([{ id: 10, nota: 4 }])
            expect(avaliacaoServiceMock.getByUsuario).toHaveBeenCalledWith('1')
        })

        test('PUT /avaliacoes/:id', async () => {
            const payload = { nota: 3, comentario: 'Boa' }
            avaliacaoServiceMock.update.mockResolvedValue({ id: 7, ...payload })

            const response = await request(app).put('/avaliacoes/7').send(payload)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ id: 7, ...payload })
            expect(avaliacaoServiceMock.update).toHaveBeenCalledWith(
                '7',
                payload.nota,
                payload.comentario
            )
        })

        test('DELETE /avaliacoes/:id', async () => {
            avaliacaoServiceMock.remove.mockResolvedValue()

            const response = await request(app).delete('/avaliacoes/7')

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({ mensagem: 'Avaliação removida' })
            expect(avaliacaoServiceMock.remove).toHaveBeenCalledWith('7')
        })
    })
})