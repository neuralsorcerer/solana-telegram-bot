import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import { logger } from "../index";

dotenv.config();

const apiKey = process.env.MERCURYO_API_KEY as string;
const apiSecret = process.env.MERCURYO_API_SECRET as string;

function createSignature(path: string, body: string, nonce: string): string {
  const message = nonce + path + body;
  return crypto.createHmac("sha256", apiSecret).update(message).digest("hex");
}

export async function createPayment(amount: number, currency: string) {
  const path = "/v1/payments";
  const nonce = Date.now().toString();
  const body = JSON.stringify({
    amount,
    currency,
    type: "buy",
  });

  const signature = createSignature(path, body, nonce);

  const headers = {
    "X-Api-Key": apiKey,
    "X-Nonce": nonce,
    "X-Signature": signature,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(`https://api.mercuryo.io${path}`, body, {
      headers,
    });
    return response.data;
  } catch (error) {
    logger.error("Mercuryo API Error:", error);
    throw error;
  }
}
