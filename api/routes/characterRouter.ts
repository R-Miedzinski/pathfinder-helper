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

  characterRouter.post('/save-new-character', (req, res) => {
    const seedData = req.body.data
    const userId = req.body.userId
    const gameId = req.body.gameId

    if (userId && gameId) {
      const directoryName = path.join(__dirname, `../storage/characters/${userId}`)

      try {
        if (!fs.existsSync(directoryName)) {
          fs.mkdirSync(directoryName)
        }
      } catch (err) {
        res.status(500).send(err)
      }

      const newCharacterFile = `${directoryName}/${gameId}.json`

      const id = `TEST-${userId}-${gameId}`
      seedData.id = id

      fs.writeFile(newCharacterFile, JSON.stringify(seedData), { flag: 'w+' }, (error) => {
        if (error) {
          res.status(500).send(error)
        } else {
          res.send('success in saving file')
        }
      })
    } else {
      const err = new Error('No user or game ID provided')

      res.status(500).send(err)
    }
  })

  characterRouter.post('/new-character-preview', (req, res) => {
    const characterFactory = new CharacterFactory(req.body, classDataLoader, raceDataLoader, featFetcher, actionsLoader)

    characterFactory
      .buildNewCharacter()
      .then(() => {
        res.send(characterFactory.createNewCharacter())
      })
      .catch((err) => res.status(500).send(err))
  })

  characterRouter.get('', (req, res) => {
    if (!req?.query?.gameId || !req?.query?.userId) {
      const error = new Error('Query parameters: gameId and userId are required')
      res.status(500).send(error)
    }

    const characterUrl = path.join(__dirname, `../storage/characters/${req.query.userId}/${req.query.gameId}.json`) //`)

    fs.readFile(characterUrl, 'utf8', (error, data) => {
      if (error) {
        res.status(500).send(error)
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
        .catch((err) => res.status(500).send(err))
    })
  })

  return characterRouter
}
