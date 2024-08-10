import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import { resourcesRouterFactory } from './routes'
import { MongoClient } from 'mongodb'
import { authRouterFactory } from './routes/authRouter'
import { gameRouterFactory } from './routes/gamesRouter'
import { GamesLoader } from './services/games-data-loader'

import * as jwt from 'jsonwebtoken'
import { isString } from 'lodash'
import parseCookie from './helpers/parse-cookie'

//For env File
dotenv.config()

const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/'
const app: Application = express()
const port = process.env.PORT || 8001
const secret = process.env.API_KEY || '12345678'

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

app.use('*', (req, res, next) => {
  console.log('connection on', req.baseUrl + req.url)
  console.log('method: ', req.method)

  next()
})

app.use('/api/auth', async (req, res, next) => {
  console.log('loading mongo')
  const client: MongoClient = await MongoClient.connect(dbURI)

  if (client) {
    const userDataDB = client.db('user-data')

    console.log('initiating user Router')
    authRouterFactory(userDataDB.collection('users'), secret)(req, res, next) // TODO: generate JWT
  }
})

app.use('/api/user/characters', async (req, res) => {
  const cookie = parseCookie(req.headers.cookie ?? '')
  let webToken
  try {
    webToken = jwt.verify(cookie.token ?? '', secret)
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  if (!isString(webToken) && webToken?.role) {
    const client: MongoClient = await MongoClient.connect(dbURI)

    if (client) {
      const collection = client.db('user-data').collection('users')

      const user = await collection.findOne({ user_code: webToken?.user_code })
      const characters = user ? user.userCharacters : []

      res.send(characters)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
})

app.use('/api/games', async (req, res, next) => {
  const cookie = parseCookie(req.headers.cookie ?? '')
  let webToken
  try {
    webToken = jwt.verify(cookie.token ?? '', secret)
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  if (!isString(webToken) && webToken?.role) {
    const client: MongoClient = await MongoClient.connect(dbURI)

    if (client) {
      const gameDB = client.db('games')

      const collection = gameDB.collection('games')

      const gamesLoader = new GamesLoader(collection, webToken?.user_code)

      gameRouterFactory(gamesLoader)(req, res, next)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
})

app.use(async (req, res, next) => {
  const cookie = parseCookie(req.headers.cookie ?? '')
  let webToken
  try {
    webToken = jwt.verify(cookie.token ?? '', secret)
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized' })
    return
  }

  if (!isString(webToken) && webToken?.role) {
    //Add entitlements handling

    const client: MongoClient = await MongoClient.connect(dbURI)

    if (client) {
      const resourceDB = client.db('game-data')
      const charactersDB = client.db('user-data')
      const gameDB = client.db('games')

      resourcesRouterFactory(resourceDB, charactersDB, gameDB)(req, res, next)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`)
})
