import express, { Router } from 'express'
import { ActionsLoader } from '../services/actions-loader'

export function actionsRouterFactory(actionsLoader: ActionsLoader): Router {
  const actionsRouter = express.Router()

  actionsRouter.get('/:ids', (req, res, next) => {
    const ids = req.params.ids.split('.')
    if (!ids?.length) {
      const err = new Error('No action ids provided')
      next(err)
    }

    actionsLoader
      .getActions(ids)
      .then((data) => res.send(data))
      .catch(next)
  })

  return actionsRouter
}
