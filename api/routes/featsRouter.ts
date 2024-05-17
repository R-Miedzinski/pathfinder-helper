import express from 'express'
import { Classes, Feat, FeatCategory, Race } from 'rpg-app-shared-package'
import { FeatFetcher } from '../helpers/feat-fetcher'

const featsRouter = express.Router()

const featFetcher = new FeatFetcher()

featsRouter.get('/race-feats', (req, res, next) => {
  const race: Race | null = <Race>req.query.race ?? null
  const level: number = <number>(<unknown>req.query.level) ?? 0

  if (!race) {
    const err = new Error('Race is required to fetch race feats')
    next(err)
  }

  featFetcher
    .getRaceFeatsDisplayWithQuery(level, race)
    .then((data) => {
      if (data.length) {
        res.send(data)
      } else {
        throw Error('No feats were found')
      }
    })
    .catch(next)
})

featsRouter.get('/class-feats', (req, res, next) => {
  const charClass: Classes | null = <Classes>req.query.class ?? null
  const level: number = <number>(<unknown>req.query.level) ?? 0

  if (!charClass) {
    const err = new Error('Character class is required to fetch class feats')
    next(err)
  }

  featFetcher
    .getClassFeatsDisplayWithQuery(level, charClass)
    .then((data) => {
      if (data.length) {
        res.send(data)
      } else {
        throw Error('No feats were found')
      }
    })
    .catch(next)
})

featsRouter.get('/:id', (req, res, next) => {
  const featMock: Feat = {
    id: req.params.id,
    name: 'mock feat 1',
    level: 1,
    category: FeatCategory.special,
    description: 'this is a test feat',
  }

  featFetcher
    .getFeatDisplayData(req.params.id)
    .then((data) => {
      res.send(data ?? featMock)
    })
    .catch(next)

  // res.send(featMock)
})

export default featsRouter
