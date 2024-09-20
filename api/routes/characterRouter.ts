import express, { Router } from 'express'
import { CharacterFactory } from '../helpers/create-character'
import { FeatFetcher } from '../services/feat-fetcher'
import { ClassDataLoader } from '../services/class-data-loader'
import { RaceDataLoader } from '../services/race-data-loader'
import { ActionsLoader } from '../services/actions-loader'
import { BackgroundDataLoader } from '../services/background-data-loader'
import { SeedCharacterData } from 'rpg-app-shared-package/dist/public-api'
import { Collection, Document, ObjectId, PushOperator } from 'mongodb'
import { session } from '../storage/constants'

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
    const user = session.user.user_code
    const gameId = req.body.gameId

    charactersDb
      .insertOne({ character: [seedData] })
      .then((result) => {
        if (result.acknowledged) {
          const id = result.insertedId

          userDb
            .updateOne({ user_code: user }, { $push: { userCharacters: id } as unknown as PushOperator<Document> })
            .catch((err) => {
              console.log('error during registering character to user')
            })

          gamesDb
            .updateOne(
              { _id: new ObjectId(gameId) },
              { $push: { characters: { user, id } } as unknown as PushOperator<Document> }
            )
            .catch((err) => {
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
    const user = session.user.user_code
    const gameId = req.query.gameId as string

    if (!user || !gameId) {
      const err = new Error('No user or game ID provided')

      res.status(500).send(err)
    }

    findUserWithCharacter(gameId, user, gamesDb)
      .then((characterId) => {
        if (characterId) {
          charactersDb.findOne<{ _id: ObjectId; character: SeedCharacterData[] }>({ _id: characterId }).then((data) => {
            res.send(data?.character.at(-1))
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
    const gameId = req?.body?.gameId
    const user = session.user.user_code
    if (!gameId || !user) {
      const error = new Error('Query parameters: gameId and userId are required')
      res.status(500).send(error)
    }

    findUserWithCharacter(gameId, user, gamesDb).then((characterId) => {
      if (characterId) {
        charactersDb.updateOne({ _id: characterId }, { $push: { character: req.body.characterData } }).then((data) => {
          res.send(data)
        })
      } else {
        res.status(500).send({ message: 'error has occured in finding user character' })
      }
    })
  })

  characterRouter.get('', (req, res) => {
    const gameId = req?.query?.gameId as string
    const user = session.user.user_code
    if (!gameId || !user) {
      const error = new Error('Query parameters: gameId and user are required')
      res.status(500).send({ message: error })
    }

    findUserWithCharacter(gameId, user, gamesDb).then((characterId) => {
      console.log('characterId found:', characterId)
      if (characterId) {
        charactersDb.findOne<{ _id: ObjectId; character: SeedCharacterData[] }>({ _id: characterId }).then((data) => {
          const characterData = data?.character.at(-1)
          console.log('character found: ', characterData?.name)

          if (characterData !== undefined) {
            const characterFactory = new CharacterFactory(
              characterData,
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

function findUserWithCharacter(gameId: string, user: string, gamesDb: Collection) {
  return gamesDb.findOne({ _id: new ObjectId(gameId) }).then((gameData) => {
    const gameCharacters: { user: string; id: ObjectId }[] = gameData?.characters ?? []

    const character = gameCharacters.find((entry) => entry.user === user)?.id

    return character
  })
}
