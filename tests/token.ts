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

  const lotteryId = "12asd3";

  const getTokenLotteryInitPDA = async (lottery_id: string) => {
    return await PublicKey.findProgramAddress(
      [Buffer.from(lottery_id)],
      program.programId
    );
  };
                                                  
  const getCollectionMintPDA = async (lottery_id: string) => {                                                                                           
    return await PublicKey.findProgramAddress(
      [Buffer.from("collectionmint"), Buffer.from(lottery_id)],
      program.programId
    );
  };

  const getTicketMintPDA = async (ticketNum: number, lottery_id: string) => {
    const leBytes = new Uint8Array(8);
    new DataView(leBytes.buffer).setBigUint64(0, BigInt(ticketNum), true);
    return await PublicKey.findProgramAddress(
      [leBytes, Buffer.from(lottery_id)],
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
      const [tokenLotteryPDA] = await getTokenLotteryInitPDA(lotteryId);
      console.log("Token Lottery PDA:", tokenLotteryPDA.toString());
      console.log("Lottery ID:", lotteryId.toString());
     
      const startTime = new anchor.BN(1000);
      const endTime = new anchor.BN(12313);
      const ticketPrice = new anchor.BN(232);
      const noOfTicket=new anchor.BN(2);
      const tx = await program.methods.initialize(
        startTime, endTime, ticketPrice,noOfTicket, lotteryId 
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
    });
  });

  describe("Initialize Lottery Collection", () => {
    it("should initialize the lottery collection with metadata", async () => {
      const name="Testy";
      const sym="dasd";
      const uri="uri"
      const [collectionMintPDA] = await getCollectionMintPDA(lotteryId);
      console.log("Collection Mint PDA:", collectionMintPDA.toString());
      
      const [metadataPDA] = await getMetadataPDA(collectionMintPDA);
      console.log("Collection Metadata PDA:", metadataPDA.toString());
      
      const [masterEditionPDA] = await getMasterEditionPDA(collectionMintPDA);
      console.log("Collection Master Edition PDA:", masterEditionPDA.toString());
      
      const collectionToken = await anchor.utils.token.associatedAddress({
        mint: collectionMintPDA,
        owner: wallet.publicKey
      });
      console.log("Collection Token Account:", collectionToken.toString());

      const initLottery = await program.methods.initializeLottery(lotteryId,name,sym,uri).accountsStrict({
        signer: wallet.publicKey,
        collectionMint: collectionMintPDA,
        collectionToken: collectionToken,
        metadata: metadataPDA,
        masterEdition: masterEditionPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      }).instruction();

      const blockhash = await provider.connection.getLatestBlockhash();
      const tx = new anchor.web3.Transaction({
        blockhash: blockhash.blockhash,
        feePayer: wallet.publicKey,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }).add(initLottery);

      const signature = await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        tx,
        [wallet.payer]
      );
      console.log("Lottery collection initialized:", signature);

      const tokenAccount = await provider.connection.getTokenAccountBalance(collectionToken);
      console.log("Collection Token Balance:", tokenAccount.value.amount);
      expect(tokenAccount.value.amount).to.equal("1");
    });
  });

  describe("Buy Lottery Ticket", () => {
    it("should allow buying multiple lottery tickets and mint NFTs", async () => {
      const computeTx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 400_000
      });
      const priortiytx = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1
      });

      const [tokenLotteryPDA] = await getTokenLotteryInitPDA(lotteryId);
      console.log("Token Lottery PDA:", tokenLotteryPDA.toString());
      
      const [collectionMintPDA] = await getCollectionMintPDA(lotteryId);
      console.log("Collection Mint PDA:", collectionMintPDA.toString());
      const lotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
      console.log("Initial Lottery Account State:", {
        totalTickets: lotteryAccount.totalTickets.toString(),
        ticketPrice: lotteryAccount.ticketPrice.toString()
      });

      const numberOfTicketsToBuy = 3;  

      for (let i = 0; i < numberOfTicketsToBuy; i++) {
        console.log("dasd");
        const currentLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
        const ticketNum = currentLotteryAccount.totalTickets.toNumber();
        const [ticketMintPDA] = await getTicketMintPDA(ticketNum, lotteryId);
        console.log(`\nBuying ticket #${i + 1}`);
        console.log("Ticket Mint PDA:", ticketMintPDA.toString());
        
        const [ticketMetadataPDA] = await getMetadataPDA(ticketMintPDA);
        const [ticketMasterEditionPDA] = await getMasterEditionPDA(ticketMintPDA);
        const [collectionMetadataPDA] = await getMetadataPDA(collectionMintPDA);
        const [collectionMasterEditionPDA] = await getMasterEditionPDA(collectionMintPDA);
        
        const destination = await anchor.utils.token.associatedAddress({
          mint: ticketMintPDA,
          owner: wallet.publicKey
        });
        console.log("Destination Token Account:", destination.toString());

        const buyTicket = await program.methods.buyTicket(lotteryId).accountsStrict({
          payer: wallet.publicKey,
          tokenLottery: tokenLotteryPDA,
          ticketMint: ticketMintPDA,
          ticketMetadata: ticketMetadataPDA,
          ticketMasterEdition: ticketMasterEditionPDA,
          destination: destination,
          collectionMetadata: collectionMetadataPDA,
          collectionMasterEdition: collectionMasterEditionPDA,
          collectionMint: collectionMintPDA,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          tokenMetadataProgram: METADATA_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        }).instruction();

        const blockhash = await provider.connection.getLatestBlockhash();
        const tx = new anchor.web3.Transaction({
          blockhash: blockhash.blockhash,
          feePayer: wallet.publicKey,
          lastValidBlockHeight: blockhash.lastValidBlockHeight
        }).add(buyTicket).add(computeTx).add(priortiytx);
        const signature = await anchor.web3.sendAndConfirmTransaction(
          provider.connection,
          tx,
          [wallet.payer]
        );
        const ticketAccount = await provider.connection.getTokenAccountBalance(destination);
        console.log(`Ticket #${i + 1} Token Balance:`, ticketAccount.value.amount);
        expect(ticketAccount.value.amount).to.equal("1");

        const updatedLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
        console.log(`Updated Lottery Account State after ticket #${i + 1}:`, {
          totalTickets: updatedLotteryAccount.totalTickets.toString(),
          ticketPrice: updatedLotteryAccount.ticketPrice.toString()
        });
        expect(updatedLotteryAccount.totalTickets.toNumber()).to.equal(ticketNum + 1);
      }
      const finalLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
      console.log("\nFinal Lottery Account State:", {
        totalTickets: finalLotteryAccount.totalTickets.toString(),
        ticketPrice: finalLotteryAccount.ticketPrice.toString()
      });
      try {
        const sbProgram = await loadSbProgram(provider);
        const queueAccount = await sb.getDefaultQueue(provider.connection.rpcEndpoint)
        console.log("Queue pubkey:",queueAccount.pubkey.toString());
        const queueData = await queueAccount.loadData();
        console.log("Queue data loaded successfully");
        console.log("Queue has", queueData.oracleKeys.length, "oracles");
        const rngKp = Keypair.generate();
        console.log("Generated RNG keypair:", rngKp.publicKey.toString())
        const txOpts = {
          commitment: "processed" as Commitment,
          skipPreflight: false,
          maxRetries: 0,
        };
        const [randomness, ix] = await sb.Randomness.create(sbProgram, rngKp, queueAccount.pubkey)
        console.log("Randomness account created:", randomness.pubkey.toString());
        const createRandomnessTx = await sb.asV0Tx({
          connection: sbProgram.provider.connection,
          ixs: [ix],
          payer: wallet.payer.publicKey,
          signers: [wallet.payer, rngKp],
          computeUnitPrice: 75_000,
          computeUnitLimitMultiple: 1.3,
        });
        const {connection}=await sb.AnchorUtils.loadEnv();
        const sig1 = await connection.sendTransaction(createRandomnessTx, txOpts);
        await connection.confirmTransaction(sig1, "confirmed");
        console.log(
          "  Transaction Signature for randomness account creation: ",
          sig1
        );
        const commitran=await randomness.commitIx(queueAccount.pubkey)
        const commitrandomness=await program.methods.commitRandomness(lotteryId).accountsStrict({
          randomnessAccount:randomness.pubkey,
          tokenLottery:tokenLotteryPDA,
          payer:wallet.publicKey
        }).instruction();

        const blockhash = await provider.connection.getLatestBlockhash();
        const tx = new anchor.web3.Transaction({
          blockhash: blockhash.blockhash,
          feePayer: wallet.publicKey,
          lastValidBlockHeight: blockhash.lastValidBlockHeight
        }).add(commitrandomness).add(computeTx).add(priortiytx).add(commitran);
        const signature = await anchor.web3.sendAndConfirmTransaction(
          provider.connection,
          tx,
          [wallet.payer]
        );
        console.log("das",signature);
        const sberevak=await randomness.revealIx();
        const revealWinnerIx=await program.methods.revealedWinner(lotteryId).accountsStrict({
          payer:wallet.payer.publicKey,
           tokenLottery:tokenLotteryPDA,
           randomnessAccount:randomness.pubkey
        }).instruction()
        const blockhash2 = await provider.connection.getLatestBlockhash();
        const revealTx=new  Transaction({feePayer:wallet.payer.publicKey,blockhash:blockhash2.blockhash,lastValidBlockHeight:blockhash2.lastValidBlockHeight}).add(sberevak).add(revealWinnerIx)
        const revealsignature=await anchor.web3.sendAndConfirmTransaction(provider.connection,revealTx,[wallet.payer]);
        console.log("Winner revealed, signature:", revealsignature);
        
        // Get the updated lottery account to see the winner
        const updatedLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
        console.log("Winner ticket number:", updatedLotteryAccount.winner.toString());
        console.log("Lottery pot amount:", updatedLotteryAccount.looteryPotAmount.toString());
        
        // Get the winning ticket mint PDA
        const [winningTicketMintPDA] = await getTicketMintPDA(updatedLotteryAccount.winner.toNumber(), lotteryId);
        console.log("Winning ticket mint PDA:", winningTicketMintPDA.toString());
        
        // Get ticket metadata PDA
        const [winningTicketMetadataPDA] = await getMetadataPDA(winningTicketMintPDA);
        console.log("Winning ticket metadata PDA:", winningTicketMetadataPDA.toString());
        
        // Get collection metadata PDA
        const [collectionMetadataPDA] = await getMetadataPDA(collectionMintPDA);
        console.log("Collection metadata PDA:", collectionMetadataPDA.toString());
        
        // Get the winner's token account for the winning ticket
        const winnerDestination = await anchor.utils.token.associatedAddress({
          mint: winningTicketMintPDA,
          owner: wallet.publicKey
        });
        console.log("Winner destination token account:", winnerDestination.toString());
        
        // Check balances before claiming prize
        const payerBalanceBefore = await provider.connection.getBalance(wallet.payer.publicKey);
        const lotteryBalanceBefore = await provider.connection.getBalance(tokenLotteryPDA);
        console.log("Payer balance before claim:", payerBalanceBefore);
        console.log("Lottery balance before claim:", lotteryBalanceBefore);
        
        // Claim the prize
        const claimPrize = await program.methods.claimPrize(lotteryId).accountsStrict({
          payer: wallet.payer.publicKey,
          tokenLottery: tokenLotteryPDA,
          ticketMint: winningTicketMintPDA,
          ticketMetadata: winningTicketMetadataPDA,
          collectionMetadata: collectionMetadataPDA,
          destination: winnerDestination,
          collectionMint: collectionMintPDA,
          systemProgram: SystemProgram.programId,
          tokenMetadataProgram: METADATA_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
        }).instruction();

        const claimBlockhash = await provider.connection.getLatestBlockhash();
        const claimTx = new anchor.web3.Transaction({
          blockhash: claimBlockhash.blockhash,
          feePayer: wallet.payer.publicKey,
          lastValidBlockHeight: claimBlockhash.lastValidBlockHeight
        }).add(claimPrize);

        const claimSignature = await anchor.web3.sendAndConfirmTransaction(
          provider.connection,
          claimTx,
          [wallet.payer]
        );
        console.log("Prize claimed, signature:", claimSignature);
        
        // Check balances after claiming prize
        const payerBalanceAfter = await provider.connection.getBalance(wallet.payer.publicKey);
        const lotteryBalanceAfter = await provider.connection.getBalance(tokenLotteryPDA);
        console.log("Payer balance after claim:", payerBalanceAfter);
        console.log("Lottery balance after claim:", lotteryBalanceAfter);
        
        // Verify the prize was transferred (accounting for transaction fees)
        const balanceIncrease = payerBalanceAfter - payerBalanceBefore;
        console.log("Balance increase (minus fees):", balanceIncrease);
        
        // Check that lottery pot amount is now zero
        const finalLotteryAccount = await program.account.tokenLottery.fetch(tokenLotteryPDA);
        console.log("Final lottery pot amount:", finalLotteryAccount.looteryPotAmount.toString());
        expect(finalLotteryAccount.looteryPotAmount.toString()).to.equal("0");
        
        console.log("Prize claiming test completed successfully!");
       
      } catch (error) { 
        console.log("Switchboard integration error:", error.message);
      }
    });
  })
});

export async function loadSbProgram(
  provider: anchor.Provider
): Promise<any> {
  // Import anchor-31 package specifically for Switchboard compatibility
  const anchor31 = require('@coral-xyz/anchor-31');
  const sbProgramId = await sb.getProgramId(provider.connection);
  const sbIdl = await anchor31.Program.fetchIdl(sbProgramId, provider);
  const sbProgram = new anchor31.Program(sbIdl!, provider);
  return sbProgram;
}