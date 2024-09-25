import { Router } from 'express'
import { CRUDController } from '../controllers/crud-controller'
import { session } from '../storage/constants'
import { Entitlements } from './get-entitlements'

export function createCrud<T extends { _id: string }>(
  router: Router,
  loader: CRUDController<T>,
  createId: (item: T) => string
): void {
  router.get('', async (req, res) => {
    if (session.entitlements.includes(Entitlements.CAN_PLAY)) {
      try {
        const items = await loader.readAll()

        res.send(items)
      } catch (err) {
        res.status(500).send(err)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  })

  router.get('/:id', async (req, res) => {
    if (session.entitlements.includes(Entitlements.CAN_PLAY)) {
      try {
        const item = await loader.read(req.params.id)

        res.send(item)
      } catch (err) {
        res.status(500).send(err)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  })

  router.put('/:id', async (req, res) => {
    if (session.entitlements.includes(Entitlements.CAN_EDIT)) {
      try {
        const id = req.params.id
        const value: T = req.body

        const response = await loader.update(id, value)

        res.send(response)
      } catch (err) {
        res.status(500).send(err)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  })

  router.post('', async (req, res) => {
    if (session.entitlements.includes(Entitlements.CAN_EDIT)) {
      try {
        const item: T = req.body

        item._id = createId(item)

        const response = await loader.create(item)

        res.status(200).send({
          ok: true,
          message: response,
        })
      } catch (err) {
        res.status(500).send(err)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  })

  router.delete('/:id', async (req, res) => {
    if (session.entitlements.includes(Entitlements.CAN_EDIT)) {
      try {
        const response = await loader.delete(req.params.id)

        res.send(response)
      } catch (err) {
        res.status(500).send(err)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  })
}
