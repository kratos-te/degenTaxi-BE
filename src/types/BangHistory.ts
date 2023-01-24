export interface BangHistory {
  id: number
  game_id: number
  random: number
  start_at: Date
  end_at: Date
  players: {
    wallet: string
    bet_amount: number
    withdraw_amount: number
  }
}
