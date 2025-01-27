import { test, beforeAll, afterAll } from 'vitest'
import { server } from '../src/app'
import request from 'supertest'

beforeAll(async () => {
    await server.ready()
})

afterAll(async () => {
    await server.close()
})

test('o usuário consegue criar uma nova transação', async () => {
    await request(server.server)
        .post('/transactions')
        .send({
            title: "Making a test",
            amount: 5000,
            type: 'credit'
        })
        .expect(201)
})