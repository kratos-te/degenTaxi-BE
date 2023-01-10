import { Player } from 'src/types/Player'
import { getKnex } from '../knex'
import { getLastGame } from './games'
import { GAME_COUNT_DOWN } from '../types/Const'
import { Server } from 'socket.io'

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../utils/Socketio'
import { getUserByWallet, updateUser } from './user'

const knex = getKnex()

export const joinPlayer = async (
  wallet: string,
  betAmount: number,
): Promise<boolean> => {
  try {
    let user = await getUserByWallet(wallet)
    if (!user) return false

    let lastGame = await getLastGame()
    if (!lastGame) return false
    let result
    if (
      new Date(lastGame.start_at).getTime() + GAME_COUNT_DOWN >
        new Date().getTime() &&
      new Date(lastGame.start_at).getTime() < new Date().getTime()
    ) {
      result = await insertPlayer({
        wallet: wallet,
        bet_amount: betAmount,
        game_id: lastGame.id,
      })
      //   if (result) return true
      //   else return false
    } else {
      result = await insertPlayer({
        wallet: wallet,
        bet_amount: betAmount,
        game_id: lastGame.id + 1,
      })
      //   if (result) return true
      //   else return false
    }
    if (result) {
      await updateUser(wallet, { balance: user.balance - betAmount })
      return true
    } else return false
  } catch (e) {
    console.log('err on joinPlayer >> ', e)
    return false
  }
}

export const insertPlayer = async (
  args: Partial<Player>,
): Promise<Player | null> => {
  try {
    let [player] = await knex<Player>('play').insert(
      {
        ...args,
      },
      '*',
    )
    return player
  } catch (e) {
    console.log('err on insertPlayer >> ', e)
    return null
  }
}

export const notifyJoinedPlayers = async (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
): Promise<void> => {
  try {
    let lastGame = await getLastGame()
    if (!lastGame) {
      io.emit('notifyJoinedPlayers', [])
      return
    }
    if (
      new Date(lastGame.start_at).getTime() <= new Date().getTime() &&
      new Date(lastGame.start_at).getTime() + GAME_COUNT_DOWN >
        new Date().getTime()
    ) {
      let gamePlayers = await getPlayersByGameId(lastGame.id)
      io.emit('notifyJoinedPlayers', gamePlayers)
    }
  } catch (e) {
    console.log('err on notifyJoinedPlayers >> ', e)
    io.emit('notifyJoinedPlayers', [])
  }
}

export const getPlayersByGameId = async (gameId: number): Promise<Player[]> => {
  try {
    let players = await knex<Player>('play').select().where({ game_id: gameId })
    return players
  } catch (e) {
    console.log('err on getPlayersByGameId >> ', e)
    return []
  }
}

export const getPlayer = async (
  gameId: number,
  wallet: string,
): Promise<Player | null> => {
  try {
    let [player] = await knex<Player>('play')
      .select()
      .where({ game_id: gameId, wallet: wallet })
    return player
  } catch (e) {
    console.log(e)
    return null
  }
}
