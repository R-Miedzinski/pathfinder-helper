import { Router } from 'express'
import { JsonDataLoader } from '../services/json-data-loader'

export function createCrud<T extends { id: string }>(
  router: Router,
  loader: JsonDataLoader<T>,
  createId: (item: T) => string
): void {
  router.get('', (req, res) => {
    try {
      const items = loader.readAll()

      res.send(items)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.get('/:id', (req, res) => {
    try {
      const item = loader.read(req.params.id)

      res.send(item)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.put('/:id', (req, res) => {
    try {
      const id = req.params.id
      const value: T = req.body

      const response = loader.update(id, value)

      res.send(response)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.post('', (req, res) => {
    try {
      const item: T = req.body

      item.id = createId(item)

      const response = loader.create(item)

      res.status(200).send({
        ok: true,
        message: response,
      })
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.delete('/:id', (req, res) => {
    try {
      const response = loader.delete(req.params.id)

      res.send(response)
    } catch (err) {
      res.status(500).send(err)
    }
  })
}
