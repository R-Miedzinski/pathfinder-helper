import express from 'express'
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

const router = express.Router()

// Declare service providers
const gamesLoader = new GamesLoader()

const featFetcher = new FeatFetcher()
const traisLoader = new TraitsLoader()
const classDataLoader = new ClassDataLoader()
const backgroundDataLoader = new BackgroundDataLoader()
const raceDataLoader = new RaceDataLoader()
const actionsLoader = new ActionsLoader()

router.use('*', (req, res, next) => {
  console.log('connection on', req.baseUrl + req.url)
  console.log('method: ', req.method)

  setTimeout(next, 500)
})

router.use('/api/user', userRouterFactory(gamesLoader))

router.use('/api/character', characterRouterFactory(classDataLoader, raceDataLoader, featFetcher, actionsLoader))

router.use('/api/spells', (req, res) => {
  res.send('spells')
})

router.use('/api/actions', actionsRouterFactory(actionsLoader))

router.use('/api/feats', featsRouterFactory(featFetcher))

router.use('/api/traits', traitsRouterFactory(traisLoader))

router.use('/api/classes', classesRouterFactory(classDataLoader))

router.use('/api/race', raceDataRouterFactory(raceDataLoader))

router.use('/api/backgrounds', backgroundsRouterFactory(backgroundDataLoader))

export default router
