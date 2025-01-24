import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

const server = fastify()

server.register(fastifyCookie)

server.register(transactionsRoutes, {
  prefix: 'transactions'
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTPP Server Running!')
  })
