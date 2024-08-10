import express, { Router } from 'express'
import { Collection } from 'mongodb'
import crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import parseCookie from '../helpers/parse-cookie'
import { isString } from 'lodash'

export function authRouterFactory(db: Collection, secret: string): Router {
  const authRouter = express.Router()

  authRouter.post('/signup', (req, res) => {
    const salt = crypto.randomBytes(16)

    db.findOne({ user_code: req.body.user_code }).then((data) => {
      if (data) {
        res.status(500).send(`Username ${req.body.username} already exists`)
      } else {
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
          if (err) {
            res.status(500).send(err)
          }

          db.insertOne({
            email: req.body.email,
            username: req.body.username,
            user_code: req.body.user_code,
            password: hashedPassword,
            salt,
            role: 'USER',
            userCharacters: [],
          })
            .then((data) => {
              res.send(data)
            })
            .catch((err) => res.status(500).send(err))
        })
      }
    })
  })

  authRouter.post('/login', (req, res) => {
    db.findOne(
      { username: req.body.username },
      {
        promoteBuffers: true,
      }
    )
      .then((data) => {
        if (!data) {
          res.status(500).send({ message: 'Incorrect username or password.' })
        } else {
          crypto.pbkdf2(req.body.password, data.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
              res.status(500).send(err)
              return
            }

            if (!crypto.timingSafeEqual(data.password, hashedPassword)) {
              res.status(500).send({ message: 'Incorrect username or password.' })
              return
            }

            const secret = process.env.API_KEY

            if (secret) {
              const payload = {
                role: data.role,
                user_code: data.user_code,
                username: data.username,
              }

              const token = jwt.sign(payload, secret, { expiresIn: 24 * 60 * 60 })
              res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 }).send(data)
            } else {
              res.status(500).send({ message: 'Error during log-in' })
            }
          })
        }
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  })

  authRouter.get('/check-token', (req, res) => {
    const cookie = parseCookie(req.headers.cookie ?? '')
    let webToken

    try {
      webToken = jwt.verify(cookie.token ?? '', secret)
    } catch (err) {
      res.status(401).send({ message: 'Token expired or invalid' })
      return
    }
    if (!isString(webToken) && webToken?.role) {
      res.send({ role: webToken?.role })
    } else {
      res.status(401).send({ message: 'Token expired or invalid' })
    }
  })

  return authRouter
}
