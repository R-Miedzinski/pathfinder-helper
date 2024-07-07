import express, { Router } from 'express'
import { CharacterFactory } from '../helpers/create-character'
import { FeatFetcher } from '../services/feat-fetcher'
import * as fs from 'fs'
import path from 'path'
import { ClassDataLoader } from '../services/class-data-loader'
import { RaceDataLoader } from '../services/race-data-loader'
import { ActionsLoader } from '../services/actions-loader'
import { BackgroundDataLoader } from '../services/background-data-loader'
import { SeedCharacterData } from 'rpg-app-shared-package/dist/public-api'

export function characterRouterFactory(
  classDataLoader: ClassDataLoader,
  raceDataLoader: RaceDataLoader,
  featFetcher: FeatFetcher,
  actionsLoader: ActionsLoader,
  backgroundDataLoader: BackgroundDataLoader
): Router {
  const characterRouter = express.Router()

  characterRouter.post('/save-new-character', (req, res) => {
    const seedData: SeedCharacterData = req.body.data
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
      seedData.feats = seedData.feats.filter(Boolean)

      fs.writeFile(newCharacterFile, JSON.stringify([seedData]), { flag: 'w+' }, (error) => {
        if (error) {
          res.status(500).send(error)
        } else {
          res.status(200).send(`<p>success in saving character: ${id}</p>`)
        }
      })
    } else {
      const err = new Error('No user or game ID provided')

      res.status(500).send(err)
    }
  })

  characterRouter.post('/new-character-preview', (req, res) => {
    const characterFactory = new CharacterFactory(
      req.body,
      classDataLoader,
      raceDataLoader,
      featFetcher,
      actionsLoader,
      backgroundDataLoader
    )

    characterFactory
      .buildNewCharacter()
      .then(() => {
        res.send(characterFactory.createNewCharacter())
      })
      .catch((err) => res.status(500).send(err))
  })

  characterRouter.get('/seed-character-data', (req, res) => {
    const userId = req.query.userId
    const gameId = req.query.gameId

    if (!userId || !gameId) {
      const err = new Error('No user or game ID provided')

      res.status(500).send(err)
    }

    const characterUrl = path.join(__dirname, `../storage/characters/${userId}/${gameId}.json`)

    fs.readFile(characterUrl, 'utf8', (error, data) => {
      if (error) {
        res.status(500).send(error)
      }

      res.send(JSON.parse(data).at(-1))
    })
  })

  characterRouter.put('/:id', (req, res) => {
    const gameId = req?.body?.gameId
    const userId = req?.body?.userId
    if (!gameId || !userId) {
      const error = new Error('Query parameters: gameId and userId are required')
      res.status(500).send(error)
    }

    const characterUrl = path.join(__dirname, `../storage/characters/${userId}/${gameId}.json`)

    fs.readFile(characterUrl, 'utf8', (error, data) => {
      if (error) {
        res.status(500).send(error)
      } else if (!req?.body?.characterData) {
        const err = new Error('no character data received')

        res.status(500).send(err)
      }

      const characterData: SeedCharacterData[] = JSON.parse(data)

      characterData.push(req.body.characterData)

      fs.writeFile(characterUrl, JSON.stringify(characterData), { flag: 'w+' }, (error) => {
        if (error) {
          res.status(500).send(error)
        } else {
          res.status(200).send({
            ok: true,
            message: `Character patched: ${gameId}/${userId}`,
          })
        }
      })
    })
  })

  characterRouter.get('', (req, res) => {
    const gameId = req?.query?.gameId
    const userId = req?.query?.userId
    if (!gameId || !userId) {
      const error = new Error('Query parameters: gameId and userId are required')
      res.status(500).send(error)
    }

    const characterUrl = path.join(__dirname, `../storage/characters/${userId}/${gameId}.json`) //`)

    fs.readFile(characterUrl, 'utf8', (error, data) => {
      if (error) {
        res.status(500).send(error)
      }

      const characterFactory = new CharacterFactory(
        JSON.parse(data).at(-1),
        classDataLoader,
        raceDataLoader,
        featFetcher,
        actionsLoader,
        backgroundDataLoader
      )

      characterFactory
        .buildNewCharacter()
        .then(() => {
          const character = characterFactory.createNewCharacter()

          res.send(character)
        })
        .catch((err) => {
          res.status(500).send(err)
        })
    })
  })

  return characterRouter
}
