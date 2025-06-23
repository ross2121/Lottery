"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/theme-provider";
import { 
  Calendar,
  Clock,
  Coins,
  Hash,
  Settings,
  Zap,
  Plus,
  Trophy,
  Users,
  Ticket,
  AlertCircle,
  CheckCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY} from "@solana/web3.js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProgram } from "@/utlis/smartcontract";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

interface LotteryConfig {
  lotteryId: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  maxTickets: string;
  description: string;
  title: string;
}

export function CreateLottery() {
  const { themeConfig } = useTheme();
  const wallet = useAnchorWallet();
  
  const [config, setConfig] = useState<LotteryConfig>({
    lotteryId: "",
    startTime: "",
    endTime: "",
    ticketPrice: "0.1",
    maxTickets: "1000",
    description: "",
    title: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
   const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!config.title.trim()) newErrors.title = "Title is required";
        if (!config.lotteryId.trim()) newErrors.lotteryId = "Lottery ID is required";
        if (config.lotteryId.length > 45) newErrors.lotteryId = "Lottery ID must be 45 characters or less";
        if (!config.description.trim()) newErrors.description = "Description is required";
        break;
      case 2:
        if (!config.startTime) newErrors.startTime = "Start time is required";
        if (!config.endTime) newErrors.endTime = "End time is required";
        if (new Date(config.startTime) >= new Date(config.endTime)) {
          newErrors.endTime = "End time must be after start time";
        }
        if (new Date(config.startTime) <= new Date()) {
          newErrors.startTime = "Start time must be in the future";
        }
        break;
      case 3:
        if (!config.ticketPrice || parseFloat(config.ticketPrice) <= 0) {
          newErrors.ticketPrice = "Valid ticket price is required";
        }
        if (!config.maxTickets || parseInt(config.maxTickets) <= 0) {
          newErrors.maxTickets = "Valid max tickets is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleCreateLottery = async () => {
    if (!validateStep(3)) return;

    setIsCreating(true);
    try {
      console.log("Creating lottery with config:", config);
      if (!wallet) {
        alert("Please connect your wallet first!");
        return;
      }
      const program = getProgram(wallet);
      if (!program) {
        alert("Failed to initialize program. Please try again.");
        return;
      }
      const programId = new PublicKey("4dMKk1DAkpifRnSWGVEjUKjNBAU8SDiPqfddGPqNeM7G");
      const [tokenLotteryPDA] = await PublicKey.findProgramAddress(
        [Buffer.from(config.lotteryId)],
        programId
      );
      const startTimeDate = new Date(config.startTime);
      const endTimeDate = new Date(config.endTime);
      const startTime = new anchor.BN(Math.floor(startTimeDate.getTime() / 1000));
      const endTime = new anchor.BN(Math.floor(endTimeDate.getTime() / 1000));
      const ticketPriceSOL = parseFloat(config.ticketPrice) || 0;
      const ticketPrice = new anchor.BN(ticketPriceSOL * 1_000_000_000);
      const noOfTicket = new anchor.BN(parseInt(config.maxTickets) || 0);
      const lotteryId = config.lotteryId;
      const tx = await program.methods.initialize(
        startTime, endTime, ticketPrice, noOfTicket, lotteryId 
      ).accountsStrict({
        signer: wallet.publicKey,
        tokenLottery: tokenLotteryPDA,
        systemProgram: SystemProgram.programId,
      }).rpc();
                                                        
  const getCollectionMintPDA = async (lottery_id: string) => {                                                                                           
    return await PublicKey.findProgramAddress(
      [Buffer.from("collectionmint"), Buffer.from(lottery_id)],
      program.programId
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
  const name="Tdasdesty";
  const sym="dadasdsd";
  const uri="urasdsi"
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
  }).rpc();
console.log("dasd");
      console.log("Token lottery initialized:", tx);
      console.log("dasddasd");
      console.log("final",initLottery);
      alert("Lottery created successfully!");
      
    } catch (error) {
      console.error("Error creating lottery:", error);
      alert("Failed to create lottery. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateConfig = (field: keyof LotteryConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: Settings },
    { number: 2, title: "Schedule", icon: Calendar },
    { number: 3, title: "Economics", icon: Coins }
  ];

  const calculatePotentialPot = () => {
    const price = parseFloat(config.ticketPrice) || 0;
    const maxTickets = parseInt(config.maxTickets) || 0;
    return price * maxTickets;
  };

  const calculateDuration = () => {
    if (!config.startTime || !config.endTime) return "";
    const start = new Date(config.startTime);
    const end = new Date(config.endTime);
    const diffMs = end.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background} ${themeConfig.text}`}>
      <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background.replace('from-slate-900', 'from-black/20')} backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent mb-4`}>
              Create New Lottery
            </h1>
            <p className="text-xl text-gray-300">
              Set up your Solana-powered lottery in just a few steps
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  const Icon = step.icon;

                  return (
                    <div key={step.number} className="flex items-center">
                      <motion.div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? `bg-gradient-to-r ${themeConfig.primary} border-transparent`
                            : isActive
                            ? `border-current ${themeConfig.accent}`
                            : "border-gray-500 text-gray-500"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </motion.div>
                      <div className="ml-3 hidden sm:block">
                        <p className={`text-sm font-medium ${isActive ? themeConfig.accent : "text-gray-400"}`}>
                          Step {step.number}
                        </p>
                        <p className={`text-xs ${isActive ? themeConfig.text : "text-gray-500"}`}>
                          {step.title}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-4 ${isCompleted ? `bg-gradient-to-r ${themeConfig.primary}` : "bg-gray-600"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${themeConfig.text}`}>
                      {(() => {
                        const IconComponent = steps[currentStep - 1].icon;
                        return <IconComponent className={`w-6 h-6 mr-3 ${themeConfig.accent}`} />;
                      })()}
                      {steps[currentStep - 1].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <Label className="text-gray-300">Lottery Title</Label>
                          <Input
                            placeholder="e.g., Weekly SOL Jackpot"
                            value={config.title}
                            onChange={(e) => updateConfig("title", e.target.value)}
                            className={`${themeConfig.cardBg} border-white/10 ${themeConfig.text} ${errors.title ? "border-red-500" : ""}`}
                          />
                          {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center">
                            <Hash className="w-4 h-4 mr-2" />
                            Lottery ID (max 45 characters)
                          </Label>
                          <Input
                            placeholder="e.g., SOL-LOTTERY-2024-001"
                            value={config.lotteryId}
                            onChange={(e) => updateConfig("lotteryId", e.target.value)}
                            className={`${themeConfig.cardBg} border-white/10 ${themeConfig.text} ${errors.lotteryId ? "border-red-500" : ""}`}
                            maxLength={45}
                          />
                          <div className="flex justify-between text-sm">
                            {errors.lotteryId && <p className="text-red-400">{errors.lotteryId}</p>}
                            <p className="text-gray-400 ml-auto">{config.lotteryId.length}/45</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Description</Label>
                          <textarea
                            placeholder="Describe your lottery, rules, and what makes it special..."
                            value={config.description}
                            onChange={(e) => updateConfig("description", e.target.value)}
                            className={`w-full h-24 px-3 py-2 rounded-md ${themeConfig.cardBg} border border-white/10 ${themeConfig.text} placeholder-gray-500 resize-none ${errors.description ? "border-red-500" : ""}`}
                          />
                          {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                        </div>
                      </motion.div>
                    )}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Start Date & Time
                            </Label>
                            <Input
                              type="datetime-local"
                              value={config.startTime}
                              onChange={(e) => updateConfig("startTime", e.target.value)}
                              className={`${themeConfig.cardBg} border-white/10 ${themeConfig.text} ${errors.startTime ? "border-red-500" : ""}`}
                            />
                            {errors.startTime && <p className="text-red-400 text-sm">{errors.startTime}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              End Date & Time
                            </Label>
                            <Input
                              type="datetime-local"
                              value={config.endTime}
                              onChange={(e) => updateConfig("endTime", e.target.value)}
                              className={`${themeConfig.cardBg} border-white/10 ${themeConfig.text} ${errors.endTime ? "border-red-500" : ""}`}
                            />
                            {errors.endTime && <p className="text-red-400 text-sm">{errors.endTime}</p>}
                          </div>
                        </div>

                        {calculateDuration() && (
                          <Alert className={`bg-opacity-10 border-opacity-30 ${themeConfig.accent.replace('text-', 'bg-').replace('-400', '-500')} ${themeConfig.accent.replace('text-', 'border-').replace('-400', '-500')}`}>
                            <Clock className={`h-4 w-4 ${themeConfig.accent}`} />
                            <AlertDescription className={`${themeConfig.accent.replace('-400', '-200')}`}>
                              Lottery duration: {calculateDuration()}
                            </AlertDescription>
                          </Alert>
                        )}
                      </motion.div>
                    )}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center">
                              <Coins className="w-4 h-4 mr-2" />
                              Ticket Price (SOL)
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="0.1"
                              value={config.ticketPrice}
                              onChange={(e) => updateConfig("ticketPrice", e.target.value)}
                              className={`${themeConfig.cardBg} border-white/10 ${themeConfig.text} ${errors.ticketPrice ? "border-red-500" : ""}`}
                            />
                            {errors.ticketPrice && <p className="text-red-400 text-sm">{errors.ticketPrice}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center">
                              <Ticket className="w-4 h-4 mr-2" />
                              Max Tickets
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              placeholder="1000"
                              value={config.maxTickets}
                              onChange={(e) => updateConfig("maxTickets", e.target.value)}
                              className={`${themeConfig.cardBg} border-white/10 ${themeConfig.text} ${errors.maxTickets ? "border-red-500" : ""}`}
                            />
                            {errors.maxTickets && <p className="text-red-400 text-sm">{errors.maxTickets}</p>}
                          </div>
                        </div>

                        <Alert className="bg-green-500/10 border-green-500/30">
                          <Trophy className="h-4 w-4 text-green-400" />
                          <AlertDescription className="text-green-200">
                            <strong>Maximum Prize Pool:</strong> {calculatePotentialPot().toFixed(2)} SOL
                            <br />
                            <span className="text-sm text-green-300">
                              This is the total if all tickets are sold
                            </span>
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                    <div className="flex justify-between pt-6 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="border-white/20 hover:border-white/40"
                      >
                        Previous
                      </Button>

                      {currentStep < 3 ? (
                        <Button
                          onClick={handleNext}
                          className={`bg-gradient-to-r ${themeConfig.primary} hover:opacity-90`}
                        >
                          Next Step
                        </Button>
                      ) : (
                        <Button
                          onClick={handleCreateLottery}
                          disabled={isCreating}
                          className={`bg-gradient-to-r ${themeConfig.primary} hover:opacity-90`}
                        >
                          {isCreating ? (
                            <>
                              <Zap className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Lottery
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

        
              <div className="space-y-6">
                <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className={`${themeConfig.text} text-lg`}>Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className={`font-bold ${themeConfig.text} text-lg`}>
                        {config.title || "Lottery Title"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        ID: {config.lotteryId || "lottery-id"}
                      </p>
                    </div>

                    {config.description && (
                      <p className="text-sm text-gray-300">{config.description}</p>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Ticket Price</span>
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                          {config.ticketPrice || "0.1"} SOL
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Max Tickets</span>
                        <span className={themeConfig.text}>{config.maxTickets || "1000"}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Max Prize</span>
                        <span className="text-green-400 font-bold">
                          {calculatePotentialPot().toFixed(2)} SOL
                        </span>
                      </div>

                      {calculateDuration() && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Duration</span>
                          <span className={themeConfig.text}>{calculateDuration()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className={`${themeConfig.text} text-lg flex items-center`}>
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                      Important Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-300">
                    <p>• Lottery tickets will be minted as NFTs on Solana</p>
                    <p>• Winner selection uses Switchboard VRF for randomness</p>
                    <p>• The entire prize pool goes to the winner</p>
                    <p>• Lottery ID must be unique and cannot be changed</p>
                    <p>• Start time must be in the future</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
