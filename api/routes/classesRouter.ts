import express from 'express'
import { cloneDeep } from 'lodash'
import { ClassData } from 'rpg-app-shared-package/dist/public-api'
import { classData } from '../storage/classData'

const classesRouter = express.Router()

const classDataArray: ClassData[] = cloneDeep(classData)
const classDataIdsArray: { id: string; name: string }[] = classDataArray.map((data) => ({
    id: data.id,
    name: data.name,
}))

classesRouter.get('', (req, res) => {
    res.send(classDataIdsArray)
})

classesRouter.get('/:id', (req, res) => {
    const classData = classDataArray.find((data) => data.id === req.params.id)
    if (!classData) {
        const error = new Error('Requested background not found')
        res.end(error)
    }

    res.send(classData)
})

export default classesRouter
