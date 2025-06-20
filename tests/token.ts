import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Token } from "../target/types/token";
import { Commitment, Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as sb from '@switchboard-xyz/on-demand'
import { expect } from "chai";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";


const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

describe("Token Lottery Program",async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.token as Program<Token>;
  
  console.log("Program ID:", program.programId.toString());
  console.log("Wallet Public Key:", wallet.publicKey.toString());
  // let switchboardprogram;
  // const rngKp=anchor.web3.Keypair.generate();
  // before("Load switchboard",async()=>{
  //   const switchboard=await anchor.Program.fetchIdl(sb.ON_DEMAND_MAINNET_PID,{connection: new anchor.web3.Connection("https://api.devnet.solana.com") }) as anchor.Idl
  //   switchboardprogram=new anchor.Program(switchboard,provider)
  // })

  const getTokenLotteryInitPDA = async (lottery_id:String) => {
    return await PublicKey.findProgramAddress(
      [Buffer.from(lottery_id)],
      program.programId
    );
  };
                                                  
  const getCollectionMintPDA = async () => {                                                                                           
    return await PublicKey.findProgramAddress(
      [Buffer.from("collectionmint")],
      program.programId
    );
  };

  const getTicketMintPDA = async (ticketNum: number) => {
    const leBytes = new Uint8Array(8);
    new DataView(leBytes.buffer).setBigUint64(0, BigInt(ticketNum), true);
    return await PublicKey.findProgramAddress(
      [leBytes],
      program.programId
    );
  };

  const getMetadataPDA = async (mint: PublicKey) => {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );
  };

  const getMasterEditionPDA = async (mint: PublicKey) => {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      METADATA_PROGRAM_ID
    );
  };

  describe("Initialize Token Lottery", () => {
    it("should initialize the token lottery with correct parameters", async () => {
      // Create a lottery ID as BN (u64)
      const lotteryId ="testfshhhadfabcfcfghjgghjb";
    
       const temp="testdfffasdassd"
      const [tokenLotteryPDA] = await getTokenLotteryInitPDA(lotteryId);
      const [testpda]=PublicKey.findProgramAddressSync([Buffer.from(temp)],program.programId);
      console.log("Token Lottery PDA:", tokenLotteryPDA.toString());
      console.log("Lottery ID:", lotteryId.toString());
      
      const startTime = new anchor.BN(1000);
      const endTime = new anchor.BN(12313);
      const ticketPrice = new anchor.BN(232);
      const tx = await program.methods.initialize(
        startTime,endTime,ticketPrice,
        lotteryId 
      ).accountsStrict({
        signer: wallet.payer.publicKey,
        tokenLottery: tokenLotteryPDA,
        systemProgram: SystemProgram.programId,
      }).instruction();
      const blockhash = await provider.connection.getLatestBlockhash();
      const tx3 = new anchor.web3.Transaction({
        blockhash: blockhash.blockhash,
        feePayer: wallet.payer.publicKey,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }).add(tx);
      const signature = await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        tx3,
        [wallet.payer]
      );
      console.log("Token lottery initialized:", signature);

      const lotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
      console.log("Lottery Account Data:", {
        bump: lotteryAccount.bump,
        startTime: lotteryAccount.startTime.toString(),
        endTime: lotteryAccount.endTime.toString(),
        ticketPrice: lotteryAccount.ticketPrice.toString(),
        totalTickets: lotteryAccount.totalTickets.toString(),
        authority: lotteryAccount.authority.toString(),
        winnerClaimed: lotteryAccount.winnerClaimed,
        looteryPotAmount: lotteryAccount.looteryPotAmount.toString(),
        randomnessAccount: lotteryAccount.randomnessAccount.toString()
      });

      expect(lotteryAccount.startTime.toString()).to.equal(startTime.toString());
      expect(lotteryAccount.endTime.toString()).to.equal(endTime.toString());
      expect(lotteryAccount.ticketPrice.toString()).to.equal(ticketPrice.toString());
      expect(lotteryAccount.authority.toString()).to.equal(wallet.payer.publicKey.toString());
    });
  });

  // describe("Initialize Lottery Collection", () => {
  //   it("should initialize the lottery collection with metadata", async () => {
  //     const [collectionMintPDA] = await getCollectionMintPDA();
  //     console.log("Collection Mint PDA:", collectionMintPDA.toString());
      
  //     const [metadataPDA] = await getMetadataPDA(collectionMintPDA);
  //     console.log("Collection Metadata PDA:", metadataPDA.toString());
      
  //     const [masterEditionPDA] = await getMasterEditionPDA(collectionMintPDA);
  //     console.log("Collection Master Edition PDA:", masterEditionPDA.toString());
      
  //     const collectionToken = await anchor.utils.token.associatedAddress({
  //       mint: collectionMintPDA,
  //       owner: wallet.publicKey
  //     });
  //     console.log("Collection Token Account:", collectionToken.toString());

  //     const initLottery = await program.methods.initializeLottery().accountsStrict({
  //       signer: wallet.publicKey,
  //       collectionMint: collectionMintPDA,
  //       collectionToken: collectionToken,
  //       metadata: metadataPDA,
  //       masterEdition: masterEditionPDA,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       tokenMetadataProgram: METADATA_PROGRAM_ID,
  //       systemProgram: SystemProgram.programId,
  //       rent: SYSVAR_RENT_PUBKEY,
  //     }).instruction();

  //     const blockhash = await provider.connection.getLatestBlockhash();
  //     const tx = new anchor.web3.Transaction({
  //       blockhash: blockhash.blockhash,
  //       feePayer: wallet.publicKey,
  //       lastValidBlockHeight: blockhash.lastValidBlockHeight
  //     }).add(initLottery);

  //     const signature = await anchor.web3.sendAndConfirmTransaction(
  //       provider.connection,
  //       tx,
  //       [wallet.payer]
  //     );
  //     console.log("Lottery collection initialized:", signature);

  //     const tokenAccount = await provider.connection.getTokenAccountBalance(collectionToken);
  //     console.log("Collection Token Balance:", tokenAccount.value.amount);
  //     expect(tokenAccount.value.amount).to.equal("1");
  //   });
  // });

  // describe("Buy Lottery Ticket", () => {
  //   it("should allow buying multiple lottery tickets and mint NFTs", async () => {
  //     const computeTx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
  //       units: 400_000
  //     });
  //     const priortiytx = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
  //       microLamports: 1
  //     });

  //     const [tokenLotteryPDA] = await getTokenLotteryInitPDA();
  //     console.log("Token Lottery PDA:", tokenLotteryPDA.toString());
      
  //     const [collectionMintPDA] = await getCollectionMintPDA();
  //     console.log("Collection Mint PDA:", collectionMintPDA.toString());
  //     const lotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
  //     console.log("Initial Lottery Account State:", {
  //       totalTickets: lotteryAccount.totalTickets.toString(),
  //       ticketPrice: lotteryAccount.ticketPrice.toString()
  //     });

  //     const numberOfTicketsToBuy =3;  

  //     for (let i = 0; i < numberOfTicketsToBuy; i++) {
  //       console.log("dasd");
  //       const currentLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
  //       const ticketNum = currentLotteryAccount.totalTickets.toNumber();
  //       const [ticketMintPDA] = await getTicketMintPDA(ticketNum);
  //       console.log(`\nBuying ticket #${i + 1}`);
  //       console.log("Ticket Mint PDA:", ticketMintPDA.toString());
        
  //       const [ticketMetadataPDA] = await getMetadataPDA(ticketMintPDA);
  //       const [ticketMasterEditionPDA] = await getMasterEditionPDA(ticketMintPDA);
  //       const [collectionMetadataPDA] = await getMetadataPDA(collectionMintPDA);
  //       const [collectionMasterEditionPDA] = await getMasterEditionPDA(collectionMintPDA);
        
  //       const destination = await anchor.utils.token.associatedAddress({
  //         mint: ticketMintPDA,
  //         owner: wallet.publicKey
  //       });
  //       console.log("Destination Token Account:", destination.toString());

  //       const buyTicket = await program.methods.buyTicket().accountsStrict({
  //         payer: wallet.publicKey,
  //         tokenLottery: tokenLotteryPDA,
  //         ticketMint: ticketMintPDA,
  //         ticketMetadata: ticketMetadataPDA,
  //         ticketMasterEdition: ticketMasterEditionPDA,
  //         destination: destination,
  //         collectionMetadata: collectionMetadataPDA,
  //         collectionMasterEdition: collectionMasterEditionPDA,
  //         collectionMint: collectionMintPDA,
  //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         systemProgram: SystemProgram.programId,
  //         tokenMetadataProgram: METADATA_PROGRAM_ID,
  //         rent: SYSVAR_RENT_PUBKEY,
  //       }).instruction();

  //       const blockhash = await provider.connection.getLatestBlockhash();
  //       const tx = new anchor.web3.Transaction({
  //         blockhash: blockhash.blockhash,
  //         feePayer: wallet.publicKey,
  //         lastValidBlockHeight: blockhash.lastValidBlockHeight
  //       }).add(buyTicket).add(computeTx).add(priortiytx);

  //       const signature = await anchor.web3.sendAndConfirmTransaction(
  //         provider.connection,
  //         tx,
  //         [wallet.payer]
  //       );
  //       console.log(`Ticket #${i + 1} bought:`, signature);

  //       const ticketAccount = await provider.connection.getTokenAccountBalance(destination);
  //       console.log(`Ticket #${i + 1} Token Balance:`, ticketAccount.value.amount);
  //       expect(ticketAccount.value.amount).to.equal("1");

  //       const updatedLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
  //       console.log(`Updated Lottery Account State after ticket #${i + 1}:`, {
  //         totalTickets: updatedLotteryAccount.totalTickets.toString(),
  //         ticketPrice: updatedLotteryAccount.ticketPrice.toString()
  //       });
  //       expect(updatedLotteryAccount.totalTickets.toNumber()).to.equal(ticketNum + 1);
  //     }

  //     // "A43DyUGA7s8eXPxqEjJY6EBu1KKbNgfxF8h17VAHn13w"
  //     const finalLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
  //     console.log("\nFinal Lottery Account State:", {
  //       totalTickets: finalLotteryAccount.totalTickets.toString(),
  //       ticketPrice: finalLotteryAccount.ticketPrice.toString()
  //     });
  //     try {
  //       const pid=sb.ON_DEMAND_DEVNET_PID
  //       const sbProgram = await loadSbProgram(provider);
        
  //       const queueAccount = await sb.getDefaultQueue(provider.connection.rpcEndpoint)
  //       console.log("Queue pubkey:",queueAccount.pubkey.toString());
      
  //       const queueData = await queueAccount.loadData();
  //       console.log("Queue data loaded successfully");
  //       console.log("Queue has", queueData.oracleKeys.length, "oracles");
        
  //       const rngKp = Keypair.generate();
  //       console.log("Generated RNG keypair:", rngKp.publicKey.toString());
          
  //       const txOpts = {
  //         commitment: "processed" as Commitment,
  //         skipPreflight: false,
  //         maxRetries: 0,
  //       };
  //       const [randomness, ix] = await sb.Randomness.create(sbProgram, rngKp, queueAccount.pubkey)
  //       console.log("Randomness account created:", randomness.pubkey.toString());
  //       const createRandomnessTx = await sb.asV0Tx({
  //         connection: sbProgram.provider.connection,
  //         ixs: [ix],
  //         payer: wallet.payer.publicKey,
  //         signers: [wallet.payer, rngKp],
  //         computeUnitPrice: 75_000,
  //         computeUnitLimitMultiple: 1.3,
  //       });
  //       const {connection}=await sb.AnchorUtils.loadEnv();
  //       const sim = await connection.simulateTransaction(createRandomnessTx, txOpts);
  //       const sig1 = await connection.sendTransaction(createRandomnessTx, txOpts);
  //       await connection.confirmTransaction(sig1, "confirmed");
  //       console.log(
  //         "  Transaction Signature for randomness account creation: ",
  //         sig1
  //       );
  //       const commitran=await randomness.commitIx(queueAccount.pubkey)
  //       const commitrandomness=await program.methods.commitRandomness().accountsStrict({
  //         randomnessAccount:randomness.pubkey,
  //         tokenLottery:tokenLotteryPDA,
  //         payer:wallet.publicKey
  //       }).instruction();

  //       const blockhash = await provider.connection.getLatestBlockhash();
  //       const tx = new anchor.web3.Transaction({
  //         blockhash: blockhash.blockhash,
  //         feePayer: wallet.publicKey,
  //         lastValidBlockHeight: blockhash.lastValidBlockHeight
  //       }).add(commitrandomness).add(computeTx).add(priortiytx).add(commitran);
  //       const signature = await anchor.web3.sendAndConfirmTransaction(
  //         provider.connection,
  //         tx,
  //         [wallet.payer]
  //       );
  //       console.log("das",signature);
  //       const sberevak=await randomness.revealIx();
  //       const revealWinnerIx=await program.methods.revealedWinner().accountsStrict({
  //         payer:wallet.payer.publicKey,
  //          tokenLottery:tokenLotteryPDA,
  //          randomnessAccount:randomness.pubkey
  //       }).instruction()
  //       const blockhash2 = await provider.connection.getLatestBlockhash();
  //       const revealTx=new  Transaction({feePayer:wallet.payer.publicKey,blockhash:blockhash2.blockhash,lastValidBlockHeight:blockhash2.lastValidBlockHeight}).add(sberevak).add(revealWinnerIx)
  //       const revealsignature=await anchor.web3.sendAndConfirmTransaction(provider.connection,revealTx,[wallet.payer]);
  //       console.log("dasdas",revealsignature)
       
  //     } catch (error) { 
  //       console.log("Switchboard integration error:", error.message);
  //     }
  //   });
  // })
});

// describe("Journal Entry Program", () => {
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);
//   const wallet = provider.wallet as anchor.Wallet;
//   const program = anchor.workspace.token as Program<Token>;

//   // Helper to derive the PDA for a journal entry
//   const getJournalEntryPDA = async (title: string, owner: PublicKey) => {
//     return await PublicKey.findProgramAddress(
//       [Buffer.from(title), owner.toBuffer()],
//       program.programId
//     );
//   };

//   const testTitle = "Test Entry";
//   const testMessage = "Hello, Journal!";
//   const updatedMessage = "Updated message!";
//   let journalEntryPDA: PublicKey;

//   it("creates a journal entry", async () => {
//     [journalEntryPDA] = await getJournalEntryPDA(testTitle, wallet.publicKey);
//     const tx=await program.methods.createJournalEntry(testTitle, testMessage)
//       .accountsStrict({
//         journalEntry: journalEntryPDA,
//         owner: wallet.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .rpc();
//       console.log("pda",journalEntryPDA.toString());
//       console.log("txccc",tx);
//     const entry = await program.account.journalEntryState.fetch(journalEntryPDA);
//     expect(entry.owner.toString()).to.equal(wallet.publicKey.toString());
//     expect(entry.title).to.equal(testTitle);
//     expect(entry.message).to.equal(testMessage);
//   });

//   // it("updates a journal entry", async () => {
//   //   await program.methods.updateJournalEntry(testTitle, updatedMessage)
//   //     .accountsStrict({
//   //       journalEntry: journalEntryPDA,
//   //       owner: wallet.publicKey,
//   //       systemProgram: SystemProgram.programId,
//   //     })
//   //     .rpc();
//   //   const entry = await program.account.journalEntryState.fetch(journalEntryPDA);
//   //   expect(entry.message).to.equal(updatedMessage);
//   // });

//   // it("deletes a journal entry", async () => {
//   //   await program.methods.deleteJournalEntry(testTitle)
//   //     .accountsStrict({
//   //       journalEntry: journalEntryPDA,
//   //       owner: wallet.publicKey,
//   //       systemProgram: SystemProgram.programId,
//   //     })
//   //     .rpc();
//   //   // After deletion, fetching should fail
//   //   let err = null;
//   //   try {
//   //     await program.account.journalEntryState.fetch(journalEntryPDA);
//   //   } catch (e) {
//   //     err = e;
//   //   }
//   //   expect(err).to.not.be.null;
//   // });
// });

// export async function loadSbProgram(
//   provider: anchor.Provider
// ): Promise<any> {
//   // Import anchor-31 package specifically for Switchboard compatibility
//   const anchor31 = require('@coral-xyz/anchor-31');
//   const sbProgramId = await sb.getProgramId(provider.connection);
//   const sbIdl = await anchor31.Program.fetchIdl(sbProgramId, provider);
//   const sbProgram = new anchor31.Program(sbIdl!, provider);
//   return sbProgram;
// }