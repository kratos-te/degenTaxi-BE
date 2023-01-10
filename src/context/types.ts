import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey("A6gEoFvGyNPyYjYs7kQLibAsn3H8wD5f4rVDvBjTVace");
export const TREASURY_WALLET = new PublicKey("G42V1DfQKKHrxxfdjDrRphPStZx5Jqu2JwShfN3WoKmK");
export const BE_ADDRESS = new PublicKey("3wXAk9JUYqbVcXyYtNAgQzHz7m47CzQ6kRPennxpJFtU");
export const ADMIN = new PublicKey("3wXAk9JUYqbVcXyYtNAgQzHz7m47CzQ6kRPennxpJFtU");
export const GLOBAL_AUTHORITY_SEED = "global-authority-v1";
export const GAME_POOL_SEED = "game-pool-v1";
export const TOURNAMENT_POOL_SEED = "tournament-pool-v1";
export const ESCROW_VAULT_SEED = "escrow-vault-v1";

export const AUTO_START_TIME = 300000;
export const AUTO_FOLD_TIME = 30000;

export interface GlobalPool {
    // 8 + 128
    super_admin: PublicKey, // 32
    admin: PublicKey,       // 32
    backend: PublicKey,     // 32
    treasury: PublicKey,    // 32
}

export interface GamePool {
    table_count: anchor.BN,   // 8
    stack: anchor.BN[],       // 8*10
    buy_in: anchor.BN[],      // 8*10
    blinds: anchor.BN[],      // 8*10
    max_seats: number[],      // 1*10
}


export interface GamePoolOnChain {
    tableCount: anchor.BN,   // 8
    stack: anchor.BN[],       // 8*10
    buyIn: anchor.BN[],      // 8*10
    blinds: anchor.BN[],      // 8*10
    maxSeats: number[],      // 1*10
}