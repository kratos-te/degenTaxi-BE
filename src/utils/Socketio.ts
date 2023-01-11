import { Player } from "src/types/Player";
// import { checkAccount } from '../mng/user'
import { User } from "src/types/User";

export interface ServerToClientEvents {
  startGame: (players: Player[]) => void;
  endGame: (random: number) => void;
  notifyJoinedPlayers: (players: Player[]) => void;
  // checkAccount: (user: User) => void

  notifyPlayerWithdrawn: (players: Player[]) => void;
  notifyCurrentGameStatus: (
    players: Player[],
    currentTaxiPosition: number,
    gameStarted: boolean
  ) => void;
  currentPositionUpdated: (currentPosition: number) => void;
}

export interface ClientToServerEvents {
  getCurrentGameStatus: (
    callback: (
      players: Player[],
      currentTaxiPosition: number,
      gameStarted: boolean
    ) => void
  ) => Promise<void>;
  joinGame: (
    wallet: string,
    betAmount: number,
    callback: (result: User | null) => void
  ) => Promise<void>;
  withdrawAmount: (
    wallet: string,
    withdrawAmount: number,
    callback: (newBalance: number | null) => void
  ) => Promise<void>;
  depositAmount: (
    wallet: string,
    depositAmount: number,
    callback: (newBalance: number | null) => void
  ) => Promise<void>;
  connectWallet: (
    wallet: string,
    callback: (user: User | null) => void
  ) => void;
  getUserByWallet: (
    wallet: string,
    callback: (user: User | null) => void
  ) => void;
  withdrawInGame: (
    wallet: string,
    callback: (withdrawPoint: number) => void
  ) => Promise<void>;
  // getPreviousGameWinners: (
  //   gameId: string,
  //   callback: (winners: Winner[] | null, communityCards: Card[] | null) => void,
  // ) => Promise<void>
}

export interface InterServerEvents {
  // empty
}

export interface SocketData {
  // empty
}
