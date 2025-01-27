import { it, beforeAll, afterAll, describe } from 'vitest'
import { server } from '../src/app'
import request from 'supertest'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    it('should be able to create a new transactions', async () => {
        await request(server.server)
            .post('/transactions')
            .send({
                title: "Making a test",
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })
})
