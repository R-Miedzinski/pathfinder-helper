import express, { Router } from 'express'
import { CharacterFactory } from '../helpers/create-character'
import { FeatFetcher } from '../services/feat-fetcher'
import * as fs from 'fs'
import path from 'path'
import { ClassDataLoader } from '../services/class-data-loader'
import { RaceDataLoader } from '../services/race-data-loader'
import { ActionsLoader } from '../services/actions-loader'

export function characterRouterFactory(
  classDataLoader: ClassDataLoader,
  raceDataLoader: RaceDataLoader,
  featFetcher: FeatFetcher,
  actionsLoader: ActionsLoader
): Router {
  const characterRouter = express.Router()

  characterRouter.post('/new-character-preview', (req, res, next) => {
    const characterFactory = new CharacterFactory(req.body, classDataLoader, raceDataLoader, featFetcher, actionsLoader)

    characterFactory
      .buildNewCharacter()
      .then(() => {
        res.send(characterFactory.createNewCharacter())
      })
      .catch((err) => next(err))
  })

  characterRouter.get('', (req, res, next) => {
    if (!req?.query?.gameId || !req?.query?.userId) {
      const error = new Error('Query parameters: gameId and userId are required')
      next(error)
    }

    const characterUrl = path.join(__dirname, `../storage/characters/mock.json`) //${req.query.gameId}${req.query.userId}`)

    fs.readFile(characterUrl, 'utf8', (error, data) => {
      if (error) {
        next(error)
      }

      const characterFactory = new CharacterFactory(
        JSON.parse(data),
        classDataLoader,
        raceDataLoader,
        featFetcher,
        actionsLoader
      )

      characterFactory
        .buildNewCharacter()
        .then(() => {
          res.send(characterFactory.createNewCharacter())
        })
        .catch((err) => next(err))
    })
  })

  return characterRouter
}
