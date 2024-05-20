import express, { Router } from 'express'
import { cloneDeep } from 'lodash'
import { traitsData } from '../storage/traitsData'

export function traitsRouterFactory(): Router {
  const traitsRouter = express.Router()

  const traitsArray: { id: string; description: string }[] = cloneDeep(traitsData)

  traitsRouter.get('/:id', (req, res) => {
    let traitData = traitsArray.find((data) => data.id === req.params.id)
    if (!traitData) {
      // const error = new Error('Requested trait not found')
      // next(error)
      traitData = {
        id: req.params.id,
        description: 'test trait description',
      }
    }

    res.send(traitData)
  })

  return traitsRouter
}
