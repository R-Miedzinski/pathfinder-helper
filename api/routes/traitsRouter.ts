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

  return traitsRouter
}
