import express from 'express'
import { Feat, FeatCategory } from 'rpg-app-shared-package'

const featsRouter = express.Router()

featsRouter.get('/:id', (req, res) => {
  const featMock: Feat = {
    id: req.params.id,
    name: 'mock feat 1',
    level: 1,
    category: FeatCategory.class,
    description: 'this is a test feat',
  }

  res.send(featMock)
})

export default featsRouter
