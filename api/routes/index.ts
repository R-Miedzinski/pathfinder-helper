import express from 'express'
import PingController from '../controllers/ping'
import characterRouter from './characterRouter'
import raceDataRouter from './raceDataRouter'
import backgroundsRouter from './backgroundsRouter'
import classesRouter from './classesRouter'

const router = express.Router()

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

router.use('/api/character', characterRouter)

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

router.use('/api/feats', (req, res) => {
    res.send('feats')
})

router.use('/api/feat', (req, res) => {
    res.send('feat')
})

router.use('/api/classes', classesRouter)

router.use('/api/race', raceDataRouter)

router.use('/api/backgrounds', backgroundsRouter)

export default router
