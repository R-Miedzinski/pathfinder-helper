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
import { Collection, ObjectId } from 'mongodb'

export function characterRouterFactory(
  userDb: Collection,
  charactersDb: Collection,
  gamesDb: Collection,
  classDataLoader: ClassDataLoader,
  raceDataLoader: RaceDataLoader,
  featFetcher: FeatFetcher,
  actionsLoader: ActionsLoader,
  backgroundDataLoader: BackgroundDataLoader
): Router {
  const characterRouter = express.Router()

  characterRouter.post('/save-new-character', (req, res) => {
    const seedData: SeedCharacterData = req.body.data
    const user = req.body.user
    const gameId = req.body.gameId

    charactersDb
      .insertOne(seedData)
      .then((result) => {
        if (result.acknowledged) {
          const id = result.insertedId

          userDb.updateOne({ user_code: user }, { $push: { userCharacters: id } }).catch((err) => {
            console.log('error during registering character to user')
          })

          gamesDb.updateOne({ id: gameId }, { $push: { characters: id } }).catch((err) => {
            console.log('error during registering character to game')
          })
        }

        res.send(result)
      })
      .catch((err) => {
        res.status(500).send({ message: 'error occured during saving new character' })
      })
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
    const user = req.query.user
    const gameId = req.query.gameId

    if (!user || !gameId) {
      const err = new Error('No user or game ID provided')

      res.status(500).send(err)
    }

    gamesDb
      .findOne({ id: gameId })
      .then((gameData) => {
        const gameCharacters: ObjectId[] = gameData?.characters ?? []

        return userDb.findOne({ user_code: user }).then((userData) => {
          const userCharacters: ObjectId[] = userData?.userCharacters ?? []

          const sameCharacter = userCharacters.find((character: ObjectId) =>
            gameCharacters.some((char) => String(char) === String(character))
          )

          return sameCharacter
        })
      })
      .then((characterId) => {
        if (characterId) {
          charactersDb.findOne<SeedCharacterData>({ _id: characterId }).then((data) => {
            res.send(data)
          })
        } else {
          res.status(500).send({ message: 'Error has occured in finding user character' })
        }
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error has occured in finding user character' })
      })
  })

  characterRouter.put('/update', (req, res) => {
    //TODO: update level-up (update) call to work with mongo
    const gameId = req?.body?.gameId
    const userId = req?.body?.user
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
    const user = req?.query?.user
    if (!gameId || !user) {
      const error = new Error('Query parameters: gameId and user are required')
      res.status(500).send({ message: error })
    }

    gamesDb
      .findOne({ id: gameId })
      .then((gameData) => {
        const gameCharacters: ObjectId[] = gameData?.characters ?? []

        return userDb.findOne({ user_code: user }).then((userData) => {
          const userCharacters: ObjectId[] = userData?.userCharacters ?? []

          const sameCharacter = userCharacters.find((character: ObjectId) =>
            gameCharacters.some((char) => String(char) === String(character))
          )

          return sameCharacter
        })
      })
      .then((characterId) => {
        if (characterId) {
          charactersDb.findOne<SeedCharacterData>({ _id: characterId }).then((data) => {
            if (data) {
              const characterFactory = new CharacterFactory(
                data,
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
                  res.status(500).send({ message: err })
                })
            }
          })
        } else {
          res.status(500).send({ message: 'error has occured in finding user character' })
        }
      })
  })

  return characterRouter
}
