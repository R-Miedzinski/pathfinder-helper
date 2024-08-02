import { Router } from 'express'
import { CRUDController } from '../controllers/crud-controller'

export function createCrud<T extends { id: string }>(
  router: Router,
  loader: CRUDController<T>,
  createId: (item: T) => string
): void {
  router.get('', async (req, res) => {
    try {
      const items = await loader.readAll()

      res.send(items)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      const item = await loader.read(req.params.id)

      res.send(item)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id
      const value: T = req.body

      const response = await loader.update(id, value)

      res.send(response)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.post('', async (req, res) => {
    try {
      const item: T = req.body

      item.id = createId(item)

      const response = await loader.create(item)

      res.status(200).send({
        ok: true,
        message: response,
      })
    } catch (err) {
      res.status(500).send(err)
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      const response = await loader.delete(req.params.id)

      res.send(response)
    } catch (err) {
      res.status(500).send(err)
    }
  })
}
