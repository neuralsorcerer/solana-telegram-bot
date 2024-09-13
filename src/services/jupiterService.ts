import axios from "axios";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import dotenv from "dotenv";
import { logger } from "../index";

dotenv.config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL as string;

export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: string
) {
  try {
    const response = await axios.get("https://quote-api.jup.ag/v4/quote", {
      params: {
        inputMint,
        outputMint,
        amount,
        slippage: 1,
      },
    });
    return response.data;
  } catch (error) {
    logger.error("Jupiter API Error:", error);
    throw error;
  }
}

export async function executeSwap(userKeypair: Keypair, route: any) {
  const connection = new Connection(SOLANA_RPC_URL);

  try {
    const { data } = await axios.post("https://quote-api.jup.ag/v4/swap", {
      route,
      userPublicKey: userKeypair.publicKey.toBase58(),
    });

    const transaction = Transaction.from(
      Buffer.from(data.swapTransaction, "base64")
    );
    transaction.sign(userKeypair);

    const txId = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(txId);

    return txId;
  } catch (error) {
    logger.error("Swap Execution Error:", error);
    throw error;
  }
}
