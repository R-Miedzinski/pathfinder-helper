import express from 'express'
import { cloneDeep } from 'lodash'
import * as CharacterMock from '../storage/character'
import { SeedCharacterData } from 'rpg-app-shared-package'
import { CharacterFactory } from '../helpers/create-character'
const characterRouter = express.Router()

const characterMock: SeedCharacterData = cloneDeep(CharacterMock.characterMock)

characterRouter.post('/new-character-preview', (req, res) => {
  const characterFactory = new CharacterFactory(req.body)

  res.send(characterFactory.createNewCharacter())
})

characterRouter.get('', (req, res, next) => {
  if (!req?.query?.gameId || !req?.query?.userId) {
    const error = new Error('Query parameters: gameId and userId are required')
    next(error)
  }

  const characterFactory = new CharacterFactory(characterMock)

  res.send(characterFactory.createNewCharacter())
})

export default characterRouter
