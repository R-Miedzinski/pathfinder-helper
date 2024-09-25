import express, { Router } from 'express'
import { RaceDataLoader } from '../services/race-data-loader'

export function raceDataRouterFactory(raceDataLoader: RaceDataLoader): Router {
  const raceDataRouter = express.Router()

  raceDataRouter.get('/:race', (req, res) => {
    const race = req.params.race
    if (!race) {
      const error = new Error('Requested race not found')
      res.status(500).send(error)
    }

    raceDataLoader
      .getRaceData(race)
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err))
  })

  return raceDataRouter
}
