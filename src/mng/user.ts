import { User } from 'src/types/User'
import { getKnex } from '../knex'
// import { Server } from 'socket.io'
// import {
//   ClientToServerEvents,
//   InterServerEvents,
//   ServerToClientEvents,
//   SocketData,
// } from '../utils/Socketio'
const knex = getKnex()

export const insertUser = async (args: Partial<User>): Promise<User | null> => {
  try {
    let users = await knex<User>('users').select().where(args)
    if (users && users.length > 0) {
      return null
    }
    const [user] = await knex<User>('users').insert(
      {
        ...args,
      },
      '*',
    )
    return user
  } catch (e) {
    console.log('err on insertUser >> ', e)
    return null
  }
}

export const getUserByWallet = async (wallet: string): Promise<User | null> => {
  try {
    let [user] = await knex<User>('users').select().where({ address: wallet })
    return user
  } catch (e) {
    console.log('err on getUserByWallet >> ', e)
    return null
  }
}

export const updateUser = async (
  wallet: string,
  args: Partial<User>,
): Promise<void> => {
  try {
    await knex<User>('games').update(args).where({ address: wallet })
  } catch (e) {
    console.log('err on updateUser >> ', e)
  }
}

export const withdrawFromAccount = async (
  wallet: string,
  withdrawAmount: number,
): Promise<number | null> => {
  try {
    let user = await getUserByWallet(wallet)
    if (!user) return null

    await updateUser(wallet, { balance: user.balance - withdrawAmount })
    return user.balance - withdrawAmount
  } catch (e) {
    console.log('err on withdraw from Account >> ', e)
    return null
  }
}

// export const checkAccount = async (io: Server<
//     ClientToServerEvents,
//     ServerToClientEvents,
//     InterServerEvents,
//     SocketData
//     >,): Promise<void> => {
//     try {
//         let checkBalance
//         io.emit('checkAccount', )
//     } catch (e) {
//         console.log('err on checkAccount >>', e)
//         io.emit('checkAccount', )
//     }
//   }

export const depositFromWallet = async (
  wallet: string,
  depositAmount: number,
): Promise<number | null> => {
  try {
    let user = await getUserByWallet(wallet)
    if (!user) return null

    await updateUser(wallet, { balance: user.balance + depositAmount })
    return user.balance + depositAmount
  } catch (e) {
    console.log('err on withdraw from Account >> ', e)
    return null
  }
}

export const getUserInfo = async (wallet: string) => {
  try {
    let newUser = getUserByWallet(wallet)
    return newUser
  } catch (e) {
    console.log('err on sendUserInfo >>', e)
    return null
  }
}
