import express from 'express'
import dotenv from 'dotenv'
// import { getKnex } from './knex'
// import { logError } from './utils/Error'
import bp from 'body-parser'
import { Server } from 'socket.io'
import { createServer } from 'http'
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './utils/Socketio'
// import { Game } from './types/Game'
//@ts-ignore-next-line
import { Hand } from 'pokersolver'
// import { sleep } from './utils/util'
import { web3 } from '@project-serum/anchor'
import * as anchor from '@project-serum/anchor'

import fs from 'fs'
import path from 'path'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
// import { IDL as BonesPokerIDL } from "./context/bones_poker_contract";
import { Keypair } from '@solana/web3.js'

import { startGame, withdrawInGame } from './mng/games'
// import { endGame } from './mng/games'
// import { callbackify } from 'util'
import { joinPlayer, notifyJoinedPlayers } from './mng/player'
import {
  withdrawFromAccount,
  depositFromWallet,
  insertUser,
  getUserInfo,
} from './mng/user'

const cluster = (process.env.SOLANA_NETWORK as web3.Cluster) || 'devnet'
let solConnection = new web3.Connection(web3.clusterApiUrl(cluster))
const BE_WALLET_ADDRESS =
  process.env.BE_WALLET || './src/context/BP-BE-devnet.json'
const walletKeypair = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(fs.readFileSync(path.resolve(BE_WALLET_ADDRESS), 'utf-8')),
  ),
  { skipValidation: true },
)
const wallet = new NodeWallet(walletKeypair)
// anchor.setProvider(anchor.AnchorProvider.local(web3.clusterApiUrl(cluster)));
// Configure the client to use the local cluster.
anchor.setProvider(
  new anchor.AnchorProvider(solConnection, wallet, {
    skipPreflight: true,
    commitment: 'confirmed',
  }),
)

// const knex = getKnex()

const app = express()
app.use(bp.json())
dotenv.config()

app.get('/', async (req, res) => {
  console.log(req.body)
  res.send('server is running...')
})

const port = process.env.PORT || 4001
const httpServer = createServer(app).listen(port, async () => {
  console.log(`Listening on port ${port}`)
  await startGame(io)
})

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer)

io.on('connection', (socket) => {
  console.log('connected socket ' + socket.id)

  socket.on('joinGame', async (wallet, betAmount) => {
    try {
      if (!wallet || !betAmount) {
        return
      }
      let joinedResult = await joinPlayer(wallet, betAmount)
      if (joinedResult) {
        await notifyJoinedPlayers(io)
      }
    } catch (e) {
      console.log('err on joinGame >> ', e)
    }
  })

  socket.on('getWithdrawAmount', async (wallet, withdrawAmount) => {
    try {
      if (!wallet || !withdrawAmount) {
        return
      }
      await withdrawFromAccount(wallet, withdrawAmount)
      // if (withdrawResult) {
      //   await checkAccount(io)
      // }
    } catch (e) {
      console.log('err on getWithdraw >>', e)
    }
  })

  socket.on('getDepositAmount', async (wallet, depositAmount) => {
    try {
      if (!wallet || !depositAmount) {
        return
      }
      await depositFromWallet(wallet, depositAmount)
    } catch (e) {
      console.log('err on getDeposit >>', e)
    }
  })

  socket.on('connectWallet', async (wallet, callback) => {
    try {
      if (!wallet) {
        return
      }
      await insertUser({ address: wallet })
      let user = await getUserInfo(wallet)
      callback(user)
    } catch (e) {
      console.log('err on connectWallet >>', e)
    }
  })

  socket.on('withdrawInGame', async (wallet, callback) => {
    try {
      if (!wallet) {
        callback(0)
        return
      }
      let amount = await withdrawInGame(wallet)
      callback(amount)
    } catch (e) {
      console.log(e)
      callback(0)
    }
  })

  // socket.on('startGame', async (gameId) => {
  //   try {
  //     const game = await getGame(gameId)
  //     if (!game) return
  //     game.startedAt = new Date()
  //     await updateGame(game.id, {
  //       startedAt: game.startedAt,
  //     })
  //     const room = getRoomName(game.id)
  //     io.to(room).emit('gameStarted')
  //     log(game.id, 'Game started')
  //     await startHand(game)

  //     // update joiable gamelist to clients
  //     let existingGames = await getExistingGames()
  //     io.emit('activeGameUpdated', existingGames)
  //   } catch (e) {
  //     logError('startGame', e)
  //   }
  // })
})
