import express from 'express'
import { cloneDeep } from 'lodash'
import * as CharacterMock from '../storage/character'
import { Character } from '../models/interfaces/character'
const characterRouter = express.Router()

const characterMock: Character = cloneDeep(CharacterMock.characterMock)

characterRouter.get('', (req, res) => {
    if (!req?.query?.gameId || !req?.query?.userId) {
        const error = new Error('Query parameters: gameId and userId are required')
        res.end(error)
    }
    res.send(characterMock)
})

export default characterRouter
