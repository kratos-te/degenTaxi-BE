import { getKnex } from '../knex'

import { Server } from 'socket.io'
import { Player } from 'src/types/Player'

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../utils/Socketio'

import { Game } from '../types/Game'
import { getPlayer, getPlayersByGameId, updatePlayer } from './player'
import { GAME_COUNT_DOWN } from '../types/Const'
import { depositFromWallet } from './user'

// const TIME_TO_START_NEW_HAND = 10_000
const knex = getKnex()

// const BANG_MAX_LIMIT = 1000
// const BANG_DECIMAL = 100

const BASIC_PERCENTAGE = 0.05
const MAIN_PERCENTAGE = 0.85

// const ELSE_PERCENTAGE = 0.1
// const SPEED = 5;

// const SPEED_INDEX=10000

export const startGame = async (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
) => {
  // let random = Math.floor(Math.random() * BANG_MAX_LIMIT) / BANG_DECIMAL;

  // let percentage = Math.floor(Math.random() * 10) + 1
  // console.log(percentage, 'precentage')

  // if (percentage % 2 === 0) {
  //   let random = Math.floor(Math.random() * BANG_MAX_LIMIT) / BANG_DECIMAL
  //   let gameDuration = random * 1000 + GAME_COUNT_DOWN
  //   console.log('random ', random)
  //   let gameStartAt = new Date().getTime()

  //   let game = await insertGame({
  //     random: random,
  //     end_at: new Date(new Date().getTime() + gameDuration),
  //   })
  //   if (!game) {
  //     setTimeout(() => {
  //       startGame(io)
  //     }, gameDuration)
  //     return
  //   }

  //   let players = await getPlayersByGameId(game.id)

  //   io.emit('startGame', players)
  //   let interval: NodeJS.Timer
  //   setTimeout(() => {
  //     interval = setInterval(() => {
  //       let currentPosition =
  //         (new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / 3000 + 1
  //       io.emit('currentPositionUpdated', currentPosition)
  //     }, 33.3)
  //   }, GAME_COUNT_DOWN)

  //   setTimeout(() => {
  //     if (!game) {
  //       return
  //     }
  //     clearInterval(interval)
  //     endGame(io, random)
  //     startGame(io)
  //   }, gameDuration)
  // } else {
  //   let random = Math.random() * Math.sqrt(2) + 1
  //   let correctRandom = random.toFixed(2)
  //   let gameDuration =
  //     Math.sqrt(Number.parseFloat(correctRandom)) * 4000 + GAME_COUNT_DOWN
  //   console.log('random ', random)
  //   let gameStartAt = new Date().getTime()

  //   let game = await insertGame({
  //     random: random,
  //     end_at: new Date(new Date().getTime() + gameDuration),
  //   })
  //   if (!game) {
  //     setTimeout(() => {
  //       startGame(io)
  //     }, gameDuration)
  //     return
  //   }

  //   let players = await getPlayersByGameId(game.id)

  //   io.emit('startGame', players)
  //   let interval: NodeJS.Timer
  //   setTimeout(() => {
  //     interval = setInterval(() => {
  //       let currentPosition =
  //         (new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / 12000 + 1
  //       io.emit('currentPositionUpdated', currentPosition)
  //     }, 33.3)
  //   }, GAME_COUNT_DOWN)

  //   setTimeout(() => {
  //     if (!game) {
  //       return
  //     }
  //     clearInterval(interval)
  //     endGame(io, random)
  //     startGame(io)
  //   }, gameDuration)
  // }

  // let gameDuration = random * 1000 + GAME_COUNT_DOWN
  // console.log('random ', random)
  // let gameStartAt = new Date().getTime()

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
  // let interval: NodeJS.Timer
  // setTimeout(() => {
  //   interval = setInterval(() => {
  //     let currentPosition =
  //       (new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / 3000 + 1
  //     io.emit('currentPositionUpdated', currentPosition)
  //   }, 33.3)
  // }, GAME_COUNT_DOWN)

  // setTimeout(() => {
  //   if (!game) {
  //     return
  //   }
  //   clearInterval(interval)
  //   endGame(io, random)
  //   startGame(io)
  // }, gameDuration)

  // io.emit("startGame", players);
  // setTimeout(() => {
  //   if (!game) {
  //     return;
  //   }
  //   endGame(io, random);
  //   startGame(io);
  // }, gameDuration);

  const controlGame = async (random: number) => {
    let gameDuration = Math.sqrt(random) * 12400 + GAME_COUNT_DOWN
    let gameStartAt = new Date().getTime()
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
    let interval: NodeJS.Timer
    setTimeout(() => {
      interval = setInterval(() => {
        // let currentPosition =
        //   (new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / 12000 + 1
        let powIndex = Math.pow(
          (new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / 70000,
          2,
        )
        let speedIndex =
          9000 +
          ((new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / 1000) * 150

        let currentPosition =
          Math.pow(
            (new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / speedIndex,
            2 + powIndex,
          ) + 1
        // console.log('powIndex>>', powIndex)

        // console.log(
        //   'position>>',
        //   currentPosition,
        //   'time',
        //   (new Date().getTime() - gameStartAt - GAME_COUNT_DOWN) / 1000,
        // )
        io.emit('currentPositionUpdated', currentPosition)
      }, 33.3)
    }, GAME_COUNT_DOWN)
    setTimeout(() => {
      if (!game) {
        return
      }
      clearInterval(interval)
      endGame(io, random)
      startGame(io)
    }, gameDuration)
  }

  let percentage = Math.random().toFixed(2)
  console.log('percentage >>>', percentage)
  if (Number.parseFloat(percentage) <= BASIC_PERCENTAGE) {
    let random = 0
    console.log('random >>>', random)
    controlGame(random)
  } else if (
    BASIC_PERCENTAGE < Number.parseFloat(percentage) &&
    Number.parseFloat(percentage) <= MAIN_PERCENTAGE
  ) {
    let random = Math.random() * 1
    console.log('random >>>', random)
    controlGame(random)
  } else if (MAIN_PERCENTAGE < Number.parseFloat(percentage)) {
    let kindPercentage = Math.random().toFixed(2)
    console.log('kindPercentage >>>', kindPercentage)
    if (Number.parseFloat(kindPercentage) <= 0.6) {
      let random = Math.random() * 9 + 2
      console.log('random >>>', random)
      controlGame(random)
    } else if (
      0.6 < Number.parseFloat(kindPercentage) &&
      Number.parseFloat(kindPercentage) <= 0.9
    ) {
      let random = Math.random() * 36 + 10
      console.log('random >>>', random)
      controlGame(random)
    } else if (0.9 < Number.parseFloat(kindPercentage)) {
      let random = Math.random() * 1000 + 37
      console.log('random >>>', random)
      controlGame(random)
    }
  }

  let gameHistory = await getGameHistory()

  console.log('gameHistory >>>', gameHistory[0].id)
  for (var i = 0; i < gameHistory.length; i++) {
    let playerHistory = await getBangHistory(gameHistory[i].id)

    console.log(
      'gameHistory>>>',
      gameHistory[i],
      'bangHistory >>>',
      playerHistory,
    )
    io.emit('sendBangHistory', playerHistory, gameHistory)
  }

  // let bangHistory = await getBangHistory()

  // io.emit('sendBangHistory', bangHistory)
}

export const getGameHistory = async (): Promise<Game[]> => {
  try {
    let game = await knex<Game>('games').select().orderBy('id', 'desc')
    return game
  } catch (e) {
    console.log('err on getGameHistory >>>', e)
    return []
  }
}

export const getBangHistory = async (gameId: number): Promise<Player[]> => {
  try {
    let players = await knex<Player>('play').select().where({ game_id: gameId })
    return players
  } catch (e) {
    console.log('err on getBangHistory>>>', e)
    return []
  }
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
  random: number,
) => {
  // let endTime = game.end_at
  io.emit('endGame', random)
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

export const withdrawInGame = async (
  wallet: string,
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
): Promise<number> => {
  try {
    let lastGame = await getLastGame()
    if (!lastGame) return 0
    console.log('start time ', new Date(lastGame.start_at).getTime())
    console.log('current time ', new Date().getTime())
    console.log('end tiem ', new Date(lastGame.end_at).getTime())
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
      let withdrawTime = new Date().getTime()

      let player = await getPlayer(lastGame.id, wallet)
      if (!player || !player.bet_amount) return 0
      let speedIndex =
        9000 +
        ((withdrawTime -
          new Date(lastGame.start_at).getTime() -
          GAME_COUNT_DOWN) /
          1000) *
          150

      let powIndex = Math.pow(
        (withdrawTime -
          new Date(lastGame.start_at).getTime() -
          GAME_COUNT_DOWN) /
          70000,
        2,
      )

      let withdrawAmount =
        player.bet_amount *
        (Math.pow(
          (withdrawTime -
            new Date(lastGame.start_at).getTime() -
            GAME_COUNT_DOWN) /
            speedIndex,
          2 + powIndex,
        ) +
          1)
      await depositFromWallet(wallet, withdrawAmount)

      console.log('random ', lastGame.random)
      console.log('withdraw time ', withdrawTime)
      console.log('betamount ', player.bet_amount)
      console.log('game duration ', gameDuration)

      await updatePlayer(lastGame.id, wallet, {
        withdraw_amount: withdrawAmount,
        balance_change: withdrawAmount,
      })

      player.balance_change = withdrawAmount - player.bet_amount
      player.withdraw_amount = withdrawAmount

      let players = await getPlayersByGameId(lastGame.id)

      io.emit('notifyPlayerWithdrawn', players)

      return withdrawAmount / player.bet_amount
    } else return 0
  } catch (e) {
    console.log('err on withdrawInGame >> ', e)
    return 0
  }
}

export const getCurrentGameStatus = async (): Promise<{
  players: Player[]
  currentTaxiPosition: number
  gameStarted: boolean
}> => {
  try {
    let lastGame = await getLastGame()
    if (!lastGame) {
      // io.emit("notifyCurrentGameStatus", [], 0, false);
      return { players: [], currentTaxiPosition: 0, gameStarted: false }
    }

    let players = await getPlayersByGameId(lastGame.id)
    if (
      new Date(lastGame.start_at).getTime() + GAME_COUNT_DOWN >
      new Date().getTime()
    ) {
      let remainedStartTime =
        new Date(lastGame.start_at).getTime() +
        GAME_COUNT_DOWN -
        new Date().getTime()
      // io.emit("notifyCurrentGameStatus", players, remainedStartTime, false);
      return {
        players: players,
        currentTaxiPosition: remainedStartTime,
        gameStarted: false,
      }
    } else {
      let currentTaxiPosition =
        new Date().getTime() -
        new Date(lastGame.start_at).getTime() -
        GAME_COUNT_DOWN
      // io.emit("notifyCurrentGameStatus", players, currentTaxiPosition, true);
      return {
        players: players,
        currentTaxiPosition: currentTaxiPosition,
        gameStarted: true,
      }
    }
  } catch (e) {
    console.log('err on notifyCurrentGameStatus >> ', e)
    // io.emit("notifyCurrentGameStatus", [], 0, false);
    return { players: [], currentTaxiPosition: 0, gameStarted: false }
  }
}
