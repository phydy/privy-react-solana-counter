import { useWallets } from '@privy-io/react-auth/solana';
import { Connection, Transaction, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import type { Example } from "./example.js";
import idl from "./example.json";

export function useIncrementCounter() {
  const { wallets } = useWallets();

  const sendTransaction = async () => {
    const solanaWallet = wallets.at(0);
    if (!solanaWallet) throw new Error('No Solana wallet found');

    const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
    const program = new Program(idl as Example, { connection });

    const incrementInstruction = await program.methods
      .increment()
      .accounts({
        counter: "DDBz1pbUF4fYNFiwLG5JkoMa9Hhg2evMP9FMFeL52K5j",
      })
      .instruction();

    const transaction = new Transaction().add(incrementInstruction);

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