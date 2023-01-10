// @ts-ignore-next-line
import { Hand } from "pokersolver";

(async () => {
  // const gameId = "9a2f8800-2597-4688-8d07-56c35df09662";
  // const knex = getKnex();
  // const [game] = await knex("games").where({ tableId: gameId });
  // console.log(game);
  // example of two winners
  const hand1 = ["8C", "3C"];
  const hand2 = ["8S", "9D"];
  const communityCards = ["KD", "QD", "KS", "JH", "JC"];
  const solverHand1 = Hand.solve([...hand1, ...communityCards]);
  const solverHand2 = Hand.solve([...hand2, ...communityCards]);
  const hands = [solverHand1, solverHand2];
  const winners = Hand.winners(hands);
  console.log(winners[0] === solverHand1);
  console.log(winners[0] === solverHand2);
  console.log(winners.length);
  console.log(winners[0].descr);
  console.log(winners[1].descr);
})();
