import express, { Router } from 'express'
import { ActionsLoader } from '../services/actions-loader'

export function actionsRouterFactory(actionsLoader: ActionsLoader): Router {
  const actionsRouter = express.Router()

  actionsRouter.get('/:ids', (req, res) => {
    const ids = req.params.ids.split('.')
    if (!ids?.length) {
      const err = new Error('No action ids provided')
      res.status(500).send(err)
    }

    actionsLoader
      .getActions(ids)
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err))
  })

  return actionsRouter
}
