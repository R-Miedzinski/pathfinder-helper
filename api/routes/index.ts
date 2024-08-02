import express, { Router } from 'express'
import { characterRouterFactory } from './characterRouter'
import { raceDataRouterFactory } from './raceDataRouter'
import { backgroundsRouterFactory } from './backgroundsRouter'
import { classesRouterFactory } from './classesRouter'
import { traitsRouterFactory } from './traitsRouter'
import { featsRouterFactory } from './featsRouter'
import { FeatFetcher } from '../services/feat-fetcher'
import { TraitsLoader } from '../services/traits-loader'
import { ClassDataLoader } from '../services/class-data-loader'
import { BackgroundDataLoader } from '../services/background-data-loader'
import { RaceDataLoader } from '../services/race-data-loader'
import { actionsRouterFactory } from './actionsRouter'
import { ActionsLoader } from '../services/actions-loader'
import { userRouterFactory } from './userRouter'
import { GamesLoader } from '../services/games-data-loader'
import { Db } from 'mongodb'

function routerFactory(db: Db): Router {
  const router = express.Router()

  // Declare service providers
  const gamesLoader = new GamesLoader()

  const featFetcher = new FeatFetcher(db.collection('feats'))
  const traisLoader = new TraitsLoader(db.collection('traits'))
  const classDataLoader = new ClassDataLoader(db.collection('classes'))
  const backgroundDataLoader = new BackgroundDataLoader(db.collection('backgrounds'))
  const raceDataLoader = new RaceDataLoader(db.collection('races'))
  const actionsLoader = new ActionsLoader(db.collection('actions'))

  router.use('*', (req, res, next) => {
    console.log('connection on', req.baseUrl + req.url)
    console.log('method: ', req.method)

    next()
  })

  router.use('/api/user', userRouterFactory(gamesLoader))

  router.use(
    '/api/character',
    characterRouterFactory(classDataLoader, raceDataLoader, featFetcher, actionsLoader, backgroundDataLoader)
  )

  router.use('/api/spells', (req, res) => {
    res.send('spells')
  })

  router.use('/api/actions', actionsRouterFactory(actionsLoader))

  router.use('/api/feats', featsRouterFactory(featFetcher))

  router.use('/api/traits', traitsRouterFactory(traisLoader))

  router.use('/api/classes', classesRouterFactory(classDataLoader))

  router.use('/api/race', raceDataRouterFactory(raceDataLoader))

  router.use('/api/backgrounds', backgroundsRouterFactory(backgroundDataLoader))

  return router
}

export default routerFactory
