import { getKnex } from '../knex'

import { Server } from 'socket.io'

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../utils/Socketio'

import { Game } from '../types/Game'
import { getPlayer, getPlayersByGameId } from './player'
import { GAME_COUNT_DOWN } from '../types/Const'
import { depositFromWallet } from './user'
// const TIME_TO_START_NEW_HAND = 10_000
const knex = getKnex()

const BANG_MAX_LIMIT = 100000
const BANG_DECIMAL = 100
const SPEED = 5

export const startGame = async (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
) => {
  // let random = Math.floor(Math.random() * BANG_MAX_LIMIT) / BANG_DECIMAL

  let discriminant = Math.floor(Math.random() * 11)
  if (discriminant % 2 == 1) {
    let random = Math.floor(Math.random() * Math.sqrt(2) + 1) / BANG_DECIMAL
    let gameDuration = (random / SPEED) * 1000 + GAME_COUNT_DOWN
    let game = await insertGame({
      random: random,
      end_at: new Date(new Date().getTime() + gameDuration),
    })
    if (!game) {
      setTimeout(() => {
        startGame(io)
      }, gameDuration)
      return
    }
    let players = await getPlayersByGameId(game.id)

    io.emit('startGame', players)
    setTimeout(() => {
      if (!game) {
        return
      }
      endGame(io)
      startGame(io)
    }, gameDuration)
  } else {
    let random =
      (Math.random() * (BANG_MAX_LIMIT - Math.sqrt(2)) + Math.sqrt(2)) /
      BANG_DECIMAL
    let gameDuration = (random / SPEED) * 1000 + GAME_COUNT_DOWN
    let game = await insertGame({
      random: random,
      end_at: new Date(new Date().getTime() + gameDuration),
    })
    if (!game) {
      setTimeout(() => {
        startGame(io)
      }, gameDuration)
      return
    }
    let players = await getPlayersByGameId(game.id)

    io.emit('startGame', players)
    setTimeout(() => {
      if (!game) {
        return
      }
      endGame(io)
      startGame(io)
    }, gameDuration)
  }

  // let game = await insertGame({
  //   random: random,
  //   end_at: new Date(new Date().getTime() + gameDuration),
  // })
  // if (!game) {
  //   setTimeout(() => {
  //     startGame(io)
  //   }, gameDuration)
  //   return
  // }

  // let players = await getPlayersByGameId(game.id)

  // io.emit('startGame', players)
  // setTimeout(() => {
  //   if (!game) {
  //     return
  //   }
  //   endGame(io)
  //   startGame(io)
  // }, gameDuration)
}

export const insertGame = async (args: Partial<Game>): Promise<Game | null> => {
  const [game] = await knex<Game>('games').insert(
    {
      ...args,
    },
    '*',
  )
  return game
}

export const endGame = async (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
) => {
  // let endTime = game.end_at
  io.emit('endGame')
}

export const getGameById = async (gameId: number): Promise<Game | null> => {
  try {
    let [game] = await knex<Game>('games').select().where({ id: gameId })
    return game
  } catch (e) {
    console.log('err on getGameById >> ', e)
    return null
  }
}

export const getLastGame = async (): Promise<Game | null> => {
  try {
    let game = await knex<Game>('games').select().orderBy('id', 'desc').limit(1)
    if (game && game[0]) {
      return game[0]
    } else {
      return null
    }
  } catch (e) {
    console.log('err on getLastGame >> ', e)
    return null
  }
}

export const withdrawInGame = async (wallet: string): Promise<number> => {
  try {
    let lastGame = await getLastGame()
    if (!lastGame) return 0
    if (
      lastGame.start_at &&
      lastGame.end_at &&
      new Date(lastGame.start_at).getTime() + GAME_COUNT_DOWN <
        new Date().getTime() &&
      new Date(lastGame.end_at).getTime() > new Date().getTime()
    ) {
      let gameDuration =
        new Date(lastGame.end_at).getTime() -
        new Date(lastGame.start_at).getTime() -
        GAME_COUNT_DOWN
      let withdrawTime =
        new Date().getTime() - new Date(lastGame.start_at).getTime()
      let player = await getPlayer(lastGame.id, wallet)
      if (!player || !player.bet_amount) return 0
      let withdrawAmount =
        (lastGame.random * withdrawTime * player.bet_amount) / gameDuration
      await depositFromWallet(wallet, withdrawAmount)

      return withdrawAmount
    } else return 0
  } catch (e) {
    console.log('err on withdrawInGame >> ', e)
    return 0
  }
}
