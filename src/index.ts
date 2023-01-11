import express from "express";
import dotenv from "dotenv";
// import { getKnex } from './knex'
// import { logError } from './utils/Error'
import bp from "body-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./utils/Socketio";
// import { Game } from './types/Game'
//@ts-ignore-next-line
import { Hand } from "pokersolver";
// import { sleep } from './utils/util'
import { getCurrentGameStatus, startGame, withdrawInGame } from "./mng/games";
// import { endGame } from './mng/games'
// import { callbackify } from 'util'
import { joinPlayer, notifyJoinedPlayers } from "./mng/player";
import {
  withdrawFromAccount,
  depositFromWallet,
  insertUser,
  getUserInfo,
} from "./mng/user";

// const knex = getKnex()

const app = express();
app.use(bp.json());
dotenv.config();

app.get("/", async (req, res) => {
  console.log(req.body);
  res.send("server is running...");
});

const port = process.env.PORT || 8080;
const httpServer = createServer(app).listen(port, async () => {
  console.log(`Listening on port ${port}`);
  await startGame(io);
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer);

io.on("connection", async (socket) => {
  console.log("connected socket " + socket.id);

  let data = await getCurrentGameStatus();

  socket.on("getCurrentGameStatus", async (callback) => {
    try {
      callback(data.players, data.currentTaxiPosition, data.gameStarted);
    } catch (e) {
      console.log("err on getCurrentGameStatus >> ", e);
      callback([], 0, false);
    }
  });
  socket.on("joinGame", async (wallet, betAmount, callback) => {
    try {
      if (!wallet || !betAmount) {
        return;
      }
      let result = await joinPlayer(wallet, betAmount);
      if (result) {
        await notifyJoinedPlayers(io);
        callback(result);
      } else {
        callback(null);
      }
    } catch (e) {
      console.log("err on joinGame >> ", e);
      callback(null);
    }
  });

  socket.on("withdrawAmount", async (wallet, withdrawAmount, callback) => {
    try {
      if (!wallet || !withdrawAmount) {
        return;
      }
      let newBalance = await withdrawFromAccount(wallet, withdrawAmount);
      callback(newBalance);
      // if (withdrawResult) {
      //   await checkAccount(io)
      // }
    } catch (e) {
      console.log("err on getWithdraw >>", e);
      callback(null);
    }
  });

  socket.on("depositAmount", async (wallet, depositAmount, callback) => {
    try {
      if (!wallet || !depositAmount) {
        return;
      }
      let newBalance = await depositFromWallet(wallet, depositAmount);

      callback(newBalance);
    } catch (e) {
      console.log("err on getDeposit >>", e);
      callback(null);
    }
  });

  socket.on("connectWallet", async (wallet, callback) => {
    try {
      if (!wallet) {
        return;
      }
      await insertUser({ address: wallet });
      let user = await getUserInfo(wallet);
      callback(user);
    } catch (e) {
      console.log("err on connectWallet >>", e);
    }
  });

  socket.on("getUserByWallet", async (wallet, callback) => {
    try {
      if (!wallet) {
        return;
      }
      let user = await getUserInfo(wallet);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>getUserByWallet >> ", user);

      callback(user);
    } catch (e) {
      console.log("err on connectWallet >>", e);
      callback(null);
    }
  });

  socket.on("withdrawInGame", async (wallet, callback) => {
    try {
      if (!wallet) {
        callback(0);
        return;
      }
      let amount = await withdrawInGame(wallet, io);
      callback(amount);
    } catch (e) {
      console.log(e);
      callback(0);
    }
  });

  // socket.on("startGame", async (gameId) => {
  //   try {
  //     const game = await getGame(gameId);
  //     if (!game) return;
  //     game.startedAt = new Date();
  //     await updateGame(game.id, {
  //       startedAt: game.startedAt,
  //     });
  //     const room = getRoomName(game.id);
  //     io.to(room).emit("gameStarted");
  //     log(game.id, "Game started");
  //     await startHand(game);

  //     // update joiable gamelist to clients
  //     let existingGames = await getExistingGames();
  //     io.emit("activeGameUpdated", existingGames);
  //   } catch (e) {
  //     logError("startGame", e);
  //   }
  // });
});
