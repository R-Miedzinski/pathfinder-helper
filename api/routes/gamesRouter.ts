import express, { Router } from 'express'
import { GamesLoader } from '../services/games-data-loader'

export function gameRouterFactory(gamesLoader: GamesLoader): Router {
  const gameRouter = express.Router()

  gameRouter.get('', (req, res) => {
    gamesLoader
      .getUserGames()
      .then((data) => {
        res.send(data)
      })
      .catch((err) => res.status(500).send(err))
  })

  return gameRouter
}
