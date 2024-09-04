import express, { Router } from 'express'
import { Collection } from 'mongodb'
import crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import parseCookie from '../helpers/parse-cookie'
import { isString } from 'lodash'
import { cookie_key, secret } from '../storage/constants'
import { UserRole } from 'rpg-app-shared-package/dist/public-api'

export function authRouterFactory(db: Collection): Router {
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
            role: UserRole.USER,
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

              const secondsInDay = 24 * 60 * 60

              const token = jwt.sign(payload, secret, { expiresIn: secondsInDay })
              res
                .cookie(cookie_key, token, { maxAge: secondsInDay * 1000 })
                .send({ message: 'User succesfully logged in', username: data.username, user_code: data.user_code })
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

  authRouter.get('/logout', (req, res) => {
    return res.clearCookie(cookie_key).status(200).send({ message: 'successfullt logged out', success: true })
  })

  authRouter.get('/check-token', (req, res) => {
    const cookie = parseCookie(req.headers.cookie ?? '')
    let webToken

    try {
      webToken = jwt.verify(cookie[cookie_key] ?? '', secret)
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

  authRouter.get('/check-unique-code', (req, res) => {
    const code = req.query.user_code ?? ''

    if (code) {
      db.findOne({ user_code: code }).then((data) => {
        if (data) {
          res.send({ isUnique: false })
        } else {
          res.send({ isUnique: true })
        }
      })
    } else {
      res.status(500).send({ message: 'empty user_code received' })
    }
  })

  return authRouter
}
