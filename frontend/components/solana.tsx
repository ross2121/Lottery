import {
    AnchorWallet,
    useConnection,
    useWallet,
    ConnectionProvider,
    WalletProvider,
  } from '@solana/wallet-adapter-react';
  import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
  
export function anchorprovider(){
    const {connection}=useConnection();
    const wallet=useWallet()
    return new AnchorProvider(connection,wallet as AnchorWallet,{
        commitment:'confirmed'
    })
}