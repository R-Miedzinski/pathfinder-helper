import express, { Router } from 'express'
import { Classes, Feat, FeatCategory, Race } from 'rpg-app-shared-package'
import { FeatFetcher } from '../services/feat-fetcher'
import { createCrud } from '../helpers/crud-initiator'

function createId(feat: Feat): string {
  return feat.name.toLowerCase().split(' ').join('-')
}

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

  featsRouter.get('/query', (req, res) => {
    const level: number = <number>(<unknown>req.query.level) ?? 0
    const category: FeatCategory = <FeatCategory>(<unknown>req.query.category)
    const trait: string | undefined = <string>req.query.trait

    if (!level || !category) {
      const err = new Error('Level and category is required to fetch feats')
      res.status(500).send(err)
    }

    featFetcher
      .getFeatsByQuery(level, category, trait)
      .then((data) => {
        if (data.length) {
          res.send(data)
        } else {
          throw Error('No feats were found')
        }
      })
      .catch((err) => res.status(500).send(err))
  })

  createCrud(featsRouter, featFetcher, createId)

  return featsRouter
}
