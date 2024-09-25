import express, { Router } from 'express'
import { ClassDataLoader } from '../services/class-data-loader'

export function classesRouterFactory(classDataLoader: ClassDataLoader): Router {
  const classesRouter = express.Router()

  classesRouter.get('', (req, res) => {
    classDataLoader
      .readAll()
      .then((data) => res.send(data.map((classData) => ({ id: classData._id, name: classData.name }))))
      .catch((err) => res.status(500).send(err))
  })

  classesRouter.get('/init/:id', (req, res) => {
    const id = req.params.id
    if (!id) {
      const err = new Error('Class id needed to get class initial data')
      res.status(500).send(err)
    }

    classDataLoader
      .getInitClassData(id)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => res.status(500).send(err))
  })

  classesRouter.get('/level/:name', (req, res) => {
    const name = req.params?.name

    if (!name) {
      const err = new Error('Class name needed to get class level up data')
      res.status(500).send(err)
    }

    classDataLoader
      .getLevelUpClassData(name)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => res.status(500).send(err))
  })

  return classesRouter
}
