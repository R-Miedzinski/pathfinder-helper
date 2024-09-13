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
import { Db } from 'mongodb'

export function resourcesRouterFactory(db: Db, charactersDb: Db, gamesDb: Db): Router {
  const router = express.Router()

  // Declare service providers
  const userCollection = charactersDb.collection('users')
  const charactersCollection = charactersDb.collection('characters')
  const gamesCollection = gamesDb.collection('games')
  const featFetcher = new FeatFetcher(db.collection('feats'))
  const traisLoader = new TraitsLoader(db.collection('traits'))
  const classDataLoader = new ClassDataLoader(db.collection('classes'))
  const backgroundDataLoader = new BackgroundDataLoader(db.collection('backgrounds'))
  const raceDataLoader = new RaceDataLoader(db.collection('races'))
  const actionsLoader = new ActionsLoader(db.collection('actions'))

  router.use(
    '/character',
    characterRouterFactory(
      userCollection,
      charactersCollection,
      gamesCollection,
      classDataLoader,
      raceDataLoader,
      featFetcher,
      actionsLoader,
      backgroundDataLoader
    )
  )

  router.use('/spells', (req, res) => {
    res.send('spells')
  })

  router.use('/actions', actionsRouterFactory(actionsLoader))

  router.use('/feats', featsRouterFactory(featFetcher))

  router.use('/traits', traitsRouterFactory(traisLoader))

  router.use('/classes', classesRouterFactory(classDataLoader))

  router.use('/race', raceDataRouterFactory(raceDataLoader))

  router.use('/backgrounds', backgroundsRouterFactory(backgroundDataLoader))

  return router
}
