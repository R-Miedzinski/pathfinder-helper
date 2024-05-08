import express from 'express'
import { cloneDeep } from 'lodash'
import { BackgroundData } from 'rpg-app-shared-package/dist/public-api'
import { backgroundData } from '../storage/backgroundData'

const backgroundsRouter = express.Router()

const backgroundDataArray: BackgroundData[] = cloneDeep(backgroundData)
const backgroundDataIdsArray: { id: string; name: string }[] = backgroundDataArray.map((data) => ({
  id: data.id,
  name: data.name,
}))

backgroundsRouter.get('', (req, res) => {
  res.send(backgroundDataIdsArray)
})

backgroundsRouter.get('/:id', (req, res, next) => {
  const backgroundData = backgroundDataArray.find((data) => data.id === req.params.id)
  if (!backgroundData) {
    const error = new Error('Requested background not found')
    next(error)
  }

  res.send(backgroundData)
})

export default backgroundsRouter
