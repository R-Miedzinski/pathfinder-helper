import express, { Router } from 'express'
import { ActionsLoader } from '../services/actions-loader'
import { CharacterAction } from 'rpg-app-shared-package/dist/public-api'
import { createCrud } from '../helpers/crud-initiator'

function createId(action: CharacterAction): string {
  return action.name.toLowerCase().split(' ').join('-')
}

export function actionsRouterFactory(actionsLoader: ActionsLoader): Router {
  const actionsRouter = express.Router()

  actionsRouter.post('/list', (req, res) => {
    const ids: string[] = req.body
    if (!ids?.length) {
      const err = new Error('No action ids provided')
      res.status(500).send(err)
    }

    const actions = [...new Set(ids)].map((id) => {
      try {
        return actionsLoader.read(id)
      } catch (err) {
        console.error('error getting action: ', id, '::', err)
        return Promise.resolve(null)
      }
    })

    Promise.all(actions)
      .then((data) => {
        const items = data.filter(Boolean)

        res.send(items)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  })

  createCrud(actionsRouter, actionsLoader, createId)

  return actionsRouter
}
