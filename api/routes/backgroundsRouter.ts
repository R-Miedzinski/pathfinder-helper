import express, { Router } from 'express'
import { BackgroundDataLoader } from '../services/background-data-loader'

export function backgroundsRouterFactory(backgroundDataLoader: BackgroundDataLoader): Router {
  const backgroundsRouter = express.Router()

  backgroundsRouter.get('', (req, res) => {
    backgroundDataLoader
      .getBackgroundDataIdArray()
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err))
  })

  backgroundsRouter.get('/:id', (req, res) => {
    const id = req.params.id
    if (!id) {
      const error = new Error('Requested background not found')
      res.status(500).send(error)
    }
    backgroundDataLoader
      .getBackroundData(id)
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err))
  })

  return backgroundsRouter
}
