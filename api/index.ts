import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db'

import Router from './routes'

const test = 'asd';

//For env File
dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8001

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('public'))

connectDB();

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/swagger.json',
        },
    })
)

app.use(Router)

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`)
})
