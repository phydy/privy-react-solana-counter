import { useWallets } from '@privy-io/react-auth/solana';
import { Connection, Transaction, PublicKey } from '@solana/web3.js';
import { BN, Program } from '@coral-xyz/anchor';
import type { SnpSolana } from "./snappipay.ts";
import idl from "./snappipay.json";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  
} from "@solana/spl-token";
import axios from 'axios';

export async function offramp() {
  const { wallets } = useWallets();

  const sendTransaction = async () => {
    const solanaWallet = wallets.at(0);
    if (!solanaWallet) throw new Error('No Solana wallet found');

    const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
    const program = new Program(idl as SnpSolana, { connection });
    const asset = PublicKey.default;
    const snappipay_state = PublicKey.findProgramAddressSync([Buffer.from("snappipay_state")], program.programId)[0];
    const asset_account = PublicKey.findProgramAddressSync([Buffer.from("asset_account"), asset.toBuffer()], program.programId)[0];
    const sender_token_account = getAssociatedTokenAddressSync(asset, new PublicKey(solanaWallet.address), false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    const asset_account_ata = getAssociatedTokenAddressSync(asset, asset_account, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    const metadata_account = PublicKey.findProgramAddressSync([Buffer.from("metadata"), asset.toBuffer()], program.programId); //metadata account derivation

    const encrypted_data = await axios.post("localhost:8080/api/encryption/encrypt_saf", { data: "254722705110", type: "B2C"});
    const offRampInstruction = await program.methods
      .offramp(new BN(300), "KEN", "Primary", encrypted_data)
      .accounts({
        signer: new PublicKey(solanaWallet.address),
        snappipay_state: snappipay_state,
        asset_account: asset_account,
        mint: asset,
        sender_token_account: sender_token_account,
        asset_account_ata: asset_account_ata,
        metadata_account: metadata_account,
        token_program: TOKEN_PROGRAM_ID,
        associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .instruction();

    const transaction = new Transaction().add(offRampInstruction);

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(solanaWallet.address);

    const serialized = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });

    const { signedTransaction } = await solanaWallet.signTransaction({
      transaction: new Uint8Array(serialized),
      chain: "solana:devnet",
    });

    const signature = await connection.sendRawTransaction(signedTransaction);

    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
    console.log('Transaction confirmed:', signature);
    return signature;
  };

  return { sendTransaction };
}