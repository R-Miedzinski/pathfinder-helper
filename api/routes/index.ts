import express from 'express'
import PingController from '../controllers/ping'
import { characterRouterFactory } from './characterRouter'
import { raceDataRouterFactory } from './raceDataRouter'
import { backgroundsRouterFactory } from './backgroundsRouter'
import { classesRouterFactory } from './classesRouter'
import { traitsRouterFactory } from './traitsRouter'
import { featsRouterFactory } from './featsRouter'
import { FeatFetcher } from '../services/feat-fetcher'
import { TraitsLoader } from '../services/traits-loader'
import { ClassDataLoader } from '../services/class-data-loader'

const router = express.Router()

// Declare service providers
const classDataLoader = new ClassDataLoader()
const featFetcher = new FeatFetcher()
const traisLoader = new TraitsLoader()

router.use('*', (req, res, next) => {
  console.log('connection on', req.baseUrl + req.url)
  console.log('method: ', req.method)

  setTimeout(next, 500)
})

router.get('/ping', async (_req, res) => {
  const response = await PingController.getTestMessage()
  return res.send(response.message)
})

router.use('/api/characters', (req, res) => {
  res.send('characters')
})

router.use('/api/character', characterRouterFactory(classDataLoader, featFetcher))

router.use('/api/spells', (req, res) => {
  res.send('spells')
})

router.use('/api/spell', (req, res) => {
  res.send('spell')
})

router.use('/api/actions', (req, res) => {
  res.send('actions')
})

router.use('/api/action', (req, res) => {
  res.send('action')
})

router.use('/api/feats', featsRouterFactory(featFetcher))

router.use('/api/feat', (req, res) => {
  res.send('feat')
})

router.use('/api/traits', traitsRouterFactory(traisLoader))

router.use('/api/classes', classesRouterFactory(classDataLoader))

router.use('/api/race', raceDataRouterFactory())

router.use('/api/backgrounds', backgroundsRouterFactory())

export default router
