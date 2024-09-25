import express, { Router } from 'express'
import { BackgroundDataLoader } from '../services/background-data-loader'
import { createCrud } from '../helpers/crud-initiator'
import { BackgroundData } from 'rpg-app-shared-package/dist/public-api'

function createId(bg: BackgroundData): string {
  return bg.name.toLowerCase().split(' ').join('-')
}

export function backgroundsRouterFactory(backgroundDataLoader: BackgroundDataLoader): Router {
  const backgroundsRouter = express.Router()

  backgroundsRouter.get('', (req, res) => {
    backgroundDataLoader
      .getBackgroundDataIdArray()
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err))
  })

  createCrud(backgroundsRouter, backgroundDataLoader, createId)

  return backgroundsRouter
}
