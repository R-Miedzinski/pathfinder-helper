import express from 'express'
import PingController from '../controllers/ping'
import { characterRouterFactory } from './characterRouter'
import { raceDataRouterFactory } from './raceDataRouter'
import { backgroundsRouterFactory } from './backgroundsRouter'
import { classesRouterFactory } from './classesRouter'
import { traitsRouterFactory } from './traitsRouter'
import { featsRouterFactory } from './featsRouter'
import { FeatFetcher } from '../helpers/feat-fetcher'

const router = express.Router()

// Declare service providers
const featFetcher = new FeatFetcher()

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

router.use('/api/character', characterRouterFactory(featFetcher))

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

router.use('/api/traits', traitsRouterFactory())

router.use('/api/classes', classesRouterFactory())

router.use('/api/race', raceDataRouterFactory())

router.use('/api/backgrounds', backgroundsRouterFactory())

export default router
