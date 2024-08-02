import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import routerFactory from './routes'
import { MongoClient } from 'mongodb'

//For env File
dotenv.config()

const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/'
const app: Application = express()
const port = process.env.PORT || 8001

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('public'))

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
)

app.use(async (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: MongoClient = await MongoClient.connect(dbURI)
  if (client) {
    const db = client.db('game-data')
    routerFactory(db)(req, res, next)
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: any, res: any) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`)
})
