import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'

import { resourcesRouterFactory } from './routes'
import { MongoClient } from 'mongodb'
import { authRouterFactory } from './routes/authRouter'
import { gameRouterFactory } from './routes/gamesRouter'
import { GamesLoader } from './services/games-data-loader'

import * as fs from 'fs'
import * as jwt from 'jsonwebtoken'
import { cloneDeep, isString } from 'lodash'
import parseCookie from './helpers/parse-cookie'
import { dbURI, emptySession, frontOrigin, port, secret, session, webRoot } from './storage/constants'
import { getEntitlementsForRole } from './helpers/get-entitlements'

//For env File
dotenv.config()

const startServer = async () => {
  const client = await MongoClient.connect(dbURI)

  const app: Application = express()

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

  app.use((req, res, next) => {
    console.log('connection on', req.baseUrl + req.url)
    console.log('method: ', req.method)
    console.log(req.headers.origin)
    console.log(req.originalUrl)

    res.set('Access-Control-Allow-Origin', frontOrigin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH')
    next()
  })

  app.options('*', cors())

  app.use('/api', (req, res, next) => {
    const cookie = parseCookie(req.headers.cookie ?? '')

    let webToken
    try {
      webToken = jwt.verify(cookie.rpg_app_web_token ?? '', secret)

      if (!isString(webToken)) {
        session.user.role = webToken?.role ?? ''
        session.user.user_code = webToken.user_code ?? ''
        session.user.username = webToken.username ?? ''

        session.entitlements = getEntitlementsForRole(session.user.role ?? '')
      }
      next()
    } catch (err) {
      try {
        console.log('token not found')
        if (req.originalUrl.includes('/api/auth')) {
          console.log('logging in, calling next')
          next()
        } else {
          console.log('not logging in, redirecting to log-in')
          res.redirect('/log-in')
        }
      } catch (err) {
        console.log('error ocurred')
        console.log(err)
        next()
      }
    }
  })

  app.use('/api/auth', async (req, res, next) => {
    try {
      // const client: MongoClient = await MongoClient.connect(dbURI)

      if (client) {
        const userDataDB = client.db('user-data')

        authRouterFactory(userDataDB.collection('users'))(req, res, next)
      }
    } catch (err) {
      console.log('error ocurred')
      console.log(err)
      next()
    }
  })

  app.use('/api/user/characters', async (req, res, next) => {
    try {
      const userInSession = session.user

      if (userInSession?.role) {
        // const client: MongoClient = await MongoClient.connect(dbURI)

        if (client) {
          const collection = client.db('user-data').collection('users')

          const user = await collection.findOne({ user_code: userInSession?.user_code })
          const characters = user ? user.userCharacters : []

          res.send(characters)
        }
      } else {
        res.status(401).send({ message: 'Unauthorized' })
      }
    } catch (err) {
      console.log('error ocurred')
      console.log(err)
      next()
    }
  })

  app.use('/api/games', async (req, res, next) => {
    try {
      const userInSession = session.user

      if (userInSession?.role) {
        // const client: MongoClient = await MongoClient.connect(dbURI)

        if (client) {
          const gameDB = client.db('games')

          const collection = gameDB.collection('games')

          const gamesLoader = new GamesLoader(collection, userInSession?.user_code ?? '')

          gameRouterFactory(gamesLoader)(req, res, next)
        }
      } else {
        res.status(401).send({ message: 'Unauthorized' })
      }
    } catch (err) {
      console.log('error ocurred')
      console.log(err)
      next()
    }
  })

  app.use('/api', async (req, res, next) => {
    try {
      const userInSession = session.user

      if (userInSession?.role) {
        // const client: MongoClient = await MongoClient.connect(dbURI)

        if (client) {
          const resourceDB = client.db('game-data')
          const charactersDB = client.db('user-data')
          const gameDB = client.db('games')

          resourcesRouterFactory(resourceDB, charactersDB, gameDB)(req, res, next)
        }
      } else {
        res.status(401).send({ message: 'Unauthorized' })
      }
    } catch (err) {
      console.log('error ocurred')
      console.log(err)
      next()
    }
  })

  app.get('*', (req, res, next) => {
    if (process.env.PRODUCTION && !req.originalUrl.includes('api')) {
      fs.stat(webRoot + req.path, function (err) {
        if (err) {
          res.sendFile('index.html', { root: webRoot })
        } else {
          res.sendFile(req.path, { root: webRoot })
        }
      })
    } else {
      next()
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  const server = app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`)
  })

  return [client, server]
}

let mongoConnection: MongoClient

startServer().then(([dbConnection, server]) => {
  mongoConnection = dbConnection as MongoClient

  server.on('connection', () => {
    session.user = cloneDeep(emptySession.user)
    session.entitlements = cloneDeep(emptySession.entitlements)
  })
})

process.on('exit', () => {
  if (mongoConnection) {
    mongoConnection.close()
  }
})
