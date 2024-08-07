import express, { Router } from 'express'
import { GamesLoader } from '../services/games-data-loader'

export function gameRouterFactory(gamesLoader: GamesLoader): Router {
  const gameRouter = express.Router()

  gameRouter.get('', (req, res) => {
    // const characterLoader = new UserCharactersLoader(id)
    // characterLoader.getUserCharacters().then((data) => {
    //   const userCharacters = data.map((entry) => entry.id)
    gamesLoader
      .getUserGames()
      .then((data) => {
        res.send(data)
      })
      .catch((err) => res.status(500).send(err))
    // })
  })

  return gameRouter
}
