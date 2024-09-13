import { Keypair } from "@solana/web3.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string; // Must be 32 bytes for AES-256

export function generateKeypair() {
  return Keypair.generate();
}

export function encryptPrivateKey(privateKey: Uint8Array): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(Buffer.from(privateKey));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

export function decryptPrivateKey(encryptedPrivateKey: string): Uint8Array {
  const encryptedText = Buffer.from(encryptedPrivateKey, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return new Uint8Array(decrypted);
}
