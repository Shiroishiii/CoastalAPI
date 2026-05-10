import request from 'supertest'
import app from '../src/app.js'

describe('API Guia de Praias 🌊', () => {

    let usuarioId
    let praiaId
    let avaliacaoId

    // =========================
    // USUARIOS
    // =========================

    describe('Usuários', () => {

        test('POST /usuarios', async () => {

            const response = await request(app)
                .post('/usuarios')
                .send({
                    nome: 'Shiro',
                    email: `shiro${Date.now()}@test.com`,
                    senha: '123456'
                })

            expect(response.statusCode).toBe(201)

            usuarioId = response.body.id

            expect(response.body).toHaveProperty('id')
        })

        test('GET /usuarios', async () => {

            const response = await request(app)
                .get('/usuarios')

            expect(response.statusCode).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
        })

        test('GET /usuarios/:id', async () => {

            const response = await request(app)
                .get(`/usuarios/${usuarioId}`)

            expect(response.statusCode).toBe(200)
            expect(response.body).toHaveProperty('id')
        })

        test('PUT /usuarios/:id', async () => {

            const response = await request(app)
                .put(`/usuarios/${usuarioId}`)
                .send({
                    nome: 'Shiro Updated',
                    email: `updated${Date.now()}@test.com`,
                    senha: '654321'
                })

            expect(response.statusCode).toBe(200)
        })
    })

    // =========================
    // PRAIAS
    // =========================

    describe('Praias', () => {

        test('POST /praias', async () => {

            const response = await request(app)
                .post('/praias')
                .send({
                    nome: 'Praia Teste',
                    regiao: 'Sul',
                    descricao: 'Praia para teste',
                    nivel_perigo: 'Verde',
                    surf: true
                })

            expect(response.statusCode).toBe(201)

            praiaId = response.body.id
        })

        test('GET /praias', async () => {

            const response = await request(app)
                .get('/praias')

            expect(response.statusCode).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
        })

        test('GET /praias/:id', async () => {

            const response = await request(app)
                .get(`/praias/${praiaId}`)

            expect(response.statusCode).toBe(200)
        })

        test('PUT /praias/:id', async () => {

            const response = await request(app)
                .put(`/praias/${praiaId}`)
                .send({
                    nome: 'Praia Atualizada',
                    regiao: 'Norte',
                    descricao: 'Descrição nova',
                    nivel_perigo: 'Amarela',
                    surf: false
                })

            expect(response.statusCode).toBe(200)
        })
    })

    // =========================
    // AVALIAÇÕES
    // =========================

    describe('Avaliações', () => {

        test('POST /avaliacoes', async () => {

            const response = await request(app)
                .post('/avaliacoes')
                .send({
                    nota: 5,
                    comentario: 'Praia incrível',
                    usuario_id: usuarioId,
                    praia_id: praiaId
                })

            expect(response.statusCode).toBe(201)

            avaliacaoId = response.body.id
        })

        test('GET /avaliacoes/praia/:id', async () => {

            const response = await request(app)
                .get(`/avaliacoes/praia/${praiaId}`)

            expect(response.statusCode).toBe(200)
        })

        test('GET /avaliacoes/usuario/:id', async () => {

            const response = await request(app)
                .get(`/avaliacoes/usuario/${usuarioId}`)

            expect(response.statusCode).toBe(200)
        })

        test('PUT /avaliacoes/:id', async () => {

            const response = await request(app)
                .put(`/avaliacoes/${avaliacaoId}`)
                .send({
                    nota: 4,
                    comentario: 'Muito boa'
                })

            expect(response.statusCode).toBe(200)
        })
    })

    // =========================
    // FAVORITOS
    // =========================

    describe('Favoritos', () => {

        test('POST /favoritos', async () => {

            const response = await request(app)
                .post('/favoritos')
                .send({
                    usuario_id: usuarioId,
                    praia_id: praiaId
                })

            expect(response.statusCode).toBe(201)
        })

        test('GET /favoritos/usuario/:id', async () => {

            const response = await request(app)
                .get(`/favoritos/usuario/${usuarioId}`)

            expect(response.statusCode).toBe(200)
        })

        test('DELETE /favoritos', async () => {

            const response = await request(app)
                .delete('/favoritos')
                .send({
                    usuario_id: usuarioId,
                    praia_id: praiaId
                })

            expect(response.statusCode).toBe(200)
        })
    })

    // =========================
    // DELETE FINAL
    // =========================

    describe('Deletes finais', () => {

        test('DELETE /avaliacoes/:id', async () => {

            const response = await request(app)
                .delete(`/avaliacoes/${avaliacaoId}`)

            expect(response.statusCode).toBe(200)
        })

        test('DELETE /usuarios/:id', async () => {

            const response = await request(app)
                .delete(`/usuarios/${usuarioId}`)

            expect(response.statusCode).toBe(200)
        })

        test('DELETE /praias/:id', async () => {

            const response = await request(app)
                .delete(`/praias/${praiaId}`)

            expect(response.statusCode).toBe(200)
        })
    })
})