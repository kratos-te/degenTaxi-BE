import * as anchor from '@project-serum/anchor';

import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
} from '@solana/web3.js';
import { ESCROW_VAULT_SEED, GamePoolOnChain, GAME_POOL_SEED, GLOBAL_AUTHORITY_SEED, PROGRAM_ID, TOURNAMENT_POOL_SEED, TREASURY_WALLET } from './types';


export const getTableData = async (
    program: anchor.Program,
) => {
    const [_globalAuthority, _global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [gamePool, _game_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GAME_POOL_SEED)],
        PROGRAM_ID,
    );

    try {
        let tableData = await program.account.gamePool.fetch(gamePool) as unknown as GamePoolOnChain;
        let tableCount = tableData.tableCount.toNumber();
        let buyIn: number[] = [];
        let blinds: number[] = [];
        let stack: number[] = [];
        for (let i = 0; i < 10; i++) {
            buyIn.push(tableData.buyIn[i].toNumber())
            blinds.push(tableData.blinds[i].toNumber())
            stack.push(tableData.stack[i].toNumber())
        }
        let result = {
            buyIn,
            blinds,
            stack,
            maxSeats: tableData.maxSeats,
            tableCount
        }


        console.log(result)
        return result;
    } catch (e) {
        console.log(e)
        return null;
    }

}

export const createInitializeTx = async (
    admin: PublicKey,
    program: anchor.Program,
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );
    const [escrowVault, escrow_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_VAULT_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.initialize(
        global_bump, escrow_bump, {
        accounts: {
            admin: admin,
            globalAuthority,
            escrowVault,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}


export const createUpdateAdminTx = async (
    admin: PublicKey,
    program: anchor.Program,
    newAdmin: PublicKey
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.updateAdmin(
        global_bump, newAdmin, {
        accounts: {
            admin: admin,
            globalAuthority,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}

export const createUpdateTreasuryTx = async (
    admin: PublicKey,
    program: anchor.Program,
    newTreasury: PublicKey
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );
    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.updateTreasury(
        global_bump, newTreasury, {
        accounts: {
            admin: admin,
            globalAuthority,
        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createUpdateBackendWalletTx = async (
    admin: PublicKey,
    program: anchor.Program,
    backend_wallet: PublicKey
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );
    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.updateBackend(
        global_bump, backend_wallet, {
        accounts: {
            admin: admin,
            globalAuthority,
        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createAddTournamentTx = async (
    admin: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [tournamentPool, tournament_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(TOURNAMENT_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.addTournament(
        global_bump, tournament_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            admin: admin,
            globalAuthority,
            tournamentPool,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createAddTableTx = async (
    admin: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [gamePool, game_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GAME_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.addTable(
        global_bump, game_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            admin: admin,
            globalAuthority,
            gamePool,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createRemoveTournamentTx = async (
    admin: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [tournamentPool, tournament_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(TOURNAMENT_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.removeTournament(
        global_bump, tournament_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            admin: admin,
            globalAuthority,
            tournamentPool
        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createRemoveTableTx = async (
    admin: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number
) => {
    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [gamePool, game_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GAME_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58(), admin.toBase58());

    tx.add(program.instruction.removeTable(
        global_bump, game_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            admin: admin,
            globalAuthority,
            gamePool
        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createEnterTournamentTx = async (
    player: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number
) => {
    const [escrowVault, escrow_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_VAULT_SEED)],
        PROGRAM_ID,
    );

    const [tournamentPool, tournament_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(TOURNAMENT_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();

    tx.add(program.instruction.enterTournament(
        escrow_bump, tournament_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            player: player,
            escrowVault,
            tournamentPool,
            systemProgram: SystemProgram.programId,

        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createEnterTableTx = async (
    player: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number
) => {
    const [escrowVault, escrow_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_VAULT_SEED)],
        PROGRAM_ID,
    );

    const [gamePool, game_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GAME_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();

    tx.add(program.instruction.enterTable(
        escrow_bump, game_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            player: player,
            escrowVault,
            gamePool,
            systemProgram: SystemProgram.programId,

        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createUserLeaveTournamentTx = async (
    admin: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number,
    user: PublicKey
) => {

    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [escrowVault, escrow_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_VAULT_SEED)],
        PROGRAM_ID,
    );

    const [tournamentPool, tournament_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GAME_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();

    tx.add(program.instruction.userLeaveTournament(
        global_bump, escrow_bump, tournament_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            owner: admin,
            globalAuthority,
            escrowVault,
            tournamentPool,
            user,
            systemProgram: SystemProgram.programId,

        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createUserLeaveTableTx = async (
    admin: PublicKey,
    program: anchor.Program,
    stack: number,
    buy_in: number,
    blinds: number,
    max_seats: number,
    user: PublicKey
) => {

    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [escrowVault, escrow_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_VAULT_SEED)],
        PROGRAM_ID,
    );

    const [gamePool, game_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GAME_POOL_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();

    tx.add(program.instruction.userLeaveTable(
        global_bump, escrow_bump, game_bump, new anchor.BN(stack), new anchor.BN(buy_in), new anchor.BN(blinds), new anchor.BN(max_seats), {
        accounts: {
            owner: admin,
            globalAuthority,
            escrowVault,
            gamePool,
            user,
            systemProgram: SystemProgram.programId,

        },
        instructions: [],
        signers: [],
    }));
    return tx;
}

export const createSendRewardTx = async (
    owner: PublicKey,
    program: anchor.Program,
    winner: PublicKey,
    totalWinnedVault: number,
    leaveVault: number
) => {

    const [globalAuthority, global_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PROGRAM_ID,
    );

    const [escrowVault, escrow_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_VAULT_SEED)],
        PROGRAM_ID,
    );

    let tx = new Transaction();

    tx.add(program.instruction.sendReward(
        global_bump, escrow_bump, new anchor.BN(totalWinnedVault), new anchor.BN(leaveVault), {
        accounts: {
            owner,
            globalAuthority,
            escrowVault,
            treasury: TREASURY_WALLET,
            winner,
            systemProgram: SystemProgram.programId,
        },
        instructions: [],
        signers: [],
    }));
    return tx;
}