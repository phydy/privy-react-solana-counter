import {
  Connection,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Program } from "@anchor-lang/core";
import type { Example } from "./target/types/example.js";
import idl from "./target/idl/example.json";
import fs from "fs";

async function main() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
 
const program = new Program(idl as Example, {
  connection,
});
 
const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf-8"));
const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));
const incrementInstruction = await program.methods
  .increment()
  .accounts({
    counter: "DDBz1pbUF4fYNFiwLG5JkoMa9Hhg2evMP9FMFeL52K5j",
  })
  .instruction();
 
const transaction = new Transaction().add(
  incrementInstruction,
);
 
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer],
);
console.log("Transaction Signature", transactionSignature);
 
console.log("Count:", "DDBz1pbUF4fYNFiwLG5JkoMa9Hhg2evMP9FMFeL52K5j");
}

main().catch(console.error);