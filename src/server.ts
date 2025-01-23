import fastify from 'fastify'
import { knex } from './database'

const server = fastify()

server.get('/hello', async () => {
  const transaction = await knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transação de teste',
    amount: 1000
  }).returning('*')

  return transaction
})

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTPP Server Running!')
  })
