import express, { Router } from 'express'
import { GamesLoader } from '../services/games-data-loader'
import { Game } from 'rpg-app-shared-package/dist/public-api'
import { session } from '../storage/constants'

export function gameRouterFactory(gamesLoader: GamesLoader): Router {
  const gameRouter = express.Router()

  gameRouter.post('/search', (req, res) => {
    const searchName = req.body?.name ?? ''
    const user = session.user.user_code ?? ''

    gamesLoader
      .findGamesByName(searchName, user)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error occured while searching game' })
      })
  })

  gameRouter.get('/join', (req, res) => {
    const user = session.user.user_code ?? ''
    const gameId = (req?.query?.id as string) ?? ''

    console.log(user)
    console.log(gameId)

    if (!user) {
      res.status(500).send({ message: 'User not found' })
    }

    if (!gameId) {
      res.status(500).send({ message: 'Game to join not identified' })
    }

    gamesLoader
      .joinGame(gameId, user)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({ message: 'error in joining the game' })
      })
  })

  gameRouter.post('', (req, res) => {
    const game: { name: string; description: string } = req.body

    if (!game) {
      res.status(500).send({ message: 'Game not received' })
    }

    const gameData = {
      name: game.name,
      description: game.description,
      gameMaster: session.user.user_code,
      characters: [],
      users: [],
    } as unknown as Game

    gamesLoader
      .create(gameData)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error occured while creating game' })
      })
  })

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
