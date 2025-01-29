import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { server } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all');
        execSync('npm run knex migrate:latest')
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

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(server.server)
            .post('/transactions')
            .send({
                title: "Making a test",
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(server.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "Making a test",
                amount: 5000,
            })
        ])

    })

    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(server.server)
            .post('/transactions')
            .send({
                title: "Making a test",
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(server.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)

        const transactionId = listTransactionsResponse.body.transactions[0].id

        const getTransactionResponse = await request(server.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies!)
        .expect(200)

        console.log(getTransactionResponse.body)

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: "Making a test",
                amount: 5000,
            })
        )

    })

    it('should be able to get the summary', async () => {
        const createTransactionResponse = await request(server.server)
            .post('/transactions')
            .send({
                title: "Making a Credit",
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        await request(server.server)
            .post('/transactions')
            .set('Cookie', cookies!)
            .send({
                title: "Making a Debit",
                amount: 2000,
                type: 'debit'
            })

            const summaryResponse = await request(server.server)
            .get('/transactions/summary')
            .set('Cookie', cookies!)
            .expect(200)

        expect(summaryResponse.body.summary).toEqual({
            amount: 3000
        })

    })
})
