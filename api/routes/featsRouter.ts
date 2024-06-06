import express, { Router } from 'express'
import { Classes, Race } from 'rpg-app-shared-package'
import { FeatFetcher } from '../services/feat-fetcher'

export function featsRouterFactory(featFetcher: FeatFetcher): Router {
  const featsRouter = express.Router()

  featsRouter.get('/race-feats', (req, res) => {
    const race: Race | null = <Race>req.query.race ?? null
    const level: number = <number>(<unknown>req.query.level) ?? 0

    if (!race) {
      const err = new Error('Race is required to fetch race feats')
      res.status(500).send(err)
    }

    featFetcher
      .getAncestryFeats(race, level)
      .then((data) => {
        if (data.length) {
          res.send(data)
        } else {
          throw Error('No feats were found')
        }
      })
      .catch((err) => res.status(500).send(err))
  })

  featsRouter.get('/heritage-feats', (req, res) => {
    const race: Race | null = <Race>req.query.race ?? null

    if (!race) {
      const err = new Error('Race is required to fetch race feats')
      res.status(500).send(err)
    }

    featFetcher
      .getHeritageFeats(race)
      .then((data) => {
        if (data.length) {
          res.send(data)
        } else {
          throw Error('No feats were found')
        }
      })
      .catch((err) => res.status(500).send(err))
  })

  featsRouter.get('/class-feats', (req, res) => {
    const charClass: Classes | null = <Classes>req.query.class ?? null
    const level: number = <number>(<unknown>req.query.level) ?? 0

    if (!charClass) {
      const err = new Error('Character class is required to fetch class feats')
      res.status(500).send(err)
    }

    featFetcher
      .getClassFeats(charClass, level)
      .then((data) => {
        if (data.length) {
          res.send(data)
        } else {
          throw Error('No feats were found')
        }
      })
      .catch((err) => res.status(500).send(err))
  })

  featsRouter.get('/:id', (req, res) => {
    featFetcher
      .getFeatData(req.params.id)
      .then((data) => {
        if (data) {
          res.send(data)
        } else {
          throw Error(`No feat with id ${req.params.id} found`)
        }
      })
      .catch((err) => res.status(500).send(err))
  })

  return featsRouter
}
