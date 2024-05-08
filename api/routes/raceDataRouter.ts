import express from 'express'
import { cloneDeep } from 'lodash'
import { raceData } from '../storage/raceData'
import { RaceData } from 'rpg-app-shared-package'

const raceDataRouter = express.Router()

const raceDataArray: RaceData[] = cloneDeep(raceData)

raceDataRouter.get('/:race', (req, res, next) => {
  const chosenRace = raceDataArray.find((raceData) => raceData.name === req.params.race)
  if (!chosenRace) {
    const error = new Error('Requested race not found')
    next(error)
  }

  res.send(chosenRace)
})

export default raceDataRouter
