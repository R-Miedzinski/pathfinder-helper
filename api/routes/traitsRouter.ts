import express, { Router } from 'express'
import { TraitsLoader } from '../services/traits-loader'
import { Trait } from 'rpg-app-shared-package/dist/public-api'
import { createCrud } from '../helpers/crud-initiator'

function createId(trait: Trait): string {
  return trait.name.toLowerCase().split(' ').join('-')
}

export function traitsRouterFactory(traitsLoader: TraitsLoader): Router {
  const traitsRouter = express.Router()

  createCrud(traitsRouter, traitsLoader, createId)

  // traitsRouter.get('/:id', (req, res) => {
  //   const id = req.params.id
  //   if (!id) {
  //     const err = new Error('Trait id parameter is required')
  //     res.status(500).send(err)
  //   }

  //   traitsLoader
  //     .getTrait(id.toLowerCase())
  //     .then((trait) => res.send(trait))
  //     .catch((err) => res.status(500).send(err))
  // })

  return traitsRouter
}
