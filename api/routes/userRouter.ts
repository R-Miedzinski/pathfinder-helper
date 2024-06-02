import express, { Router } from 'express'
import { UserCharactersLoader } from '../services/user-characters-loader'
import { GamesLoader } from '../services/games-data-loader'

export function userRouterFactory(gamesLoader: GamesLoader): Router {
  const userRouter = express.Router()

  userRouter.get('/games/:id', (req, res) => {
    const id = req.params.id
    if (!id) {
      const err = new Error('No user id provided')
      res.status(500).send(err)
      return
    }

    const characterLoader = new UserCharactersLoader(id)
    characterLoader.getUserCharacters().then((data) => {
      const userCharacters = data.map((entry) => entry.id)
      gamesLoader
        .getUserGames(userCharacters)
        .then((data) => {
          res.send(data)
        })
        .catch((err) => res.status(500).send(err))
    })
  })

  return userRouter
}
