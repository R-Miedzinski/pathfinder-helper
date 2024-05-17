import express from 'express'
// import { cloneDeep } from 'lodash'
// import * as CharacterMock from '../storage/character'
// import { SeedCharacterData } from 'rpg-app-shared-package'
import { CharacterFactory } from '../helpers/create-character'
import * as fs from 'fs'
import path from 'path'
const characterRouter = express.Router()

// const characterMock: SeedCharacterData = cloneDeep(CharacterMock.characterMock)

characterRouter.post('/new-character-preview', (req, res, next) => {
  const characterFactory = new CharacterFactory(req.body)

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

  // fs.writeFile(characterUrl, JSON.stringify(characterMock), { flag: 'a' }, (err) => {
  //   if (err) {
  //     next(err)
  //   } else {
  //     console.log('file saved succesfully')
  //     res.send('error hi hi')
  //   }
  // })

  fs.readFile(characterUrl, 'utf8', (error, data) => {
    if (error) {
      next(error)
    }

    const characterFactory = new CharacterFactory(JSON.parse(data))

    characterFactory
      .buildNewCharacter()
      .then(() => {
        res.send(characterFactory.createNewCharacter())
      })
      .catch((err) => next(err))
  })
})

export default characterRouter
