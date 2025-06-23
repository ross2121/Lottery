import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import idl from "../idl/token.json";

const network = clusterApiUrl('devnet'); 
const connection = new Connection(network, 'confirmed');

// Program ID from your smart contract
const programId = new PublicKey('4dMKk1DAkpifRnSWGVEjUKjNBAU8SDiPqfddGPqNeM7G');

// Function to get program instance with wallet
export const getProgram = (wallet: AnchorWallet | undefined) => {
  if (!wallet) return null;
  
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  
  return new Program(idl as any, provider);
};

// Export connection and program ID for use in components
export { connection, programId };