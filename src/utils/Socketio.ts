import { Player } from 'src/types/Player'
// import { checkAccount } from '../mng/user'
import { User } from 'src/types/User'

export interface ServerToClientEvents {
  startGame: (players: Player[]) => void
  endGame: () => void
  notifyJoinedPlayers: (players: Player[]) => void
  // checkAccount: (user: User) => void
  resitTournamentTable: (gameId: string) => void
}

export interface ClientToServerEvents {
  joinGame: (wallet: string, betAmount: number) => Promise<void>
  getWithdrawAmount: (wallet: string, withdrawAmount: number) => Promise<void>
  getDepositAmount: (wallet: string, depositAmount: number) => Promise<void>
  connectWallet: (wallet: string, callback: (user: User | null) => void) => void
  withdrawInGame: (
    wallet: string,
    callback: (withdrawPoint: number) => void,
  ) => Promise<void>
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
