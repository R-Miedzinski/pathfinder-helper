import express from 'express'
import { cloneDeep } from 'lodash'
import { traitsData } from '../storage/traitsData'

const traitsRouter = express.Router()

const traitsArray: { id: string; description: string }[] = cloneDeep(traitsData)

traitsRouter.get('/:id', (req, res, next) => {
  const traitData = traitsArray.find((data) => data.id === req.params.id)
  if (!traitData) {
    const error = new Error('Requested trait not found')
    next(error)
  }

  res.send(traitData)
})

export default traitsRouter
