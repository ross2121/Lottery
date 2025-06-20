"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Coins, 
  Trophy, 
  Users, 
  Clock, 
  Ticket, 
  Zap, 
  Star,
  Crown,
  Gift,
  Timer,
  TrendingUp,
  Wallet
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSwitcher, CompactThemeSwitcher } from "@/components/theme/theme-switcher";
import { useTheme } from "@/components/theme/theme-provider";

export default function LotteryPage() {
  const [ticketAmount, setTicketAmount] = useState(1);
  const [selectedLottery, setSelectedLottery] = useState("active");
  const { themeConfig } = useTheme();

  // Mock data - you'll replace this with real data
  const currentLottery = {
    id: "lottery-001",
    prizePool: 150.75,
    ticketPrice: 0.1,
    totalTickets: 1234,
    maxTickets: 10000,
    timeLeft: "2d 14h 32m",
    participants: 892,
    status: "active"
  };

  const previousWinners = [
    { id: 1, address: "9WzD...k3Lm", amount: 89.2, ticket: "#4521", time: "2 hours ago" },
    { id: 2, address: "4Hxp...9Bnc", amount: 156.8, ticket: "#7832", time: "1 day ago" },
    { id: 3, address: "8Kma...5Qrt", amount: 203.4, ticket: "#2109", time: "3 days ago" },
  ];

  const lotteryStats = [
    { title: "Total Prize Distributed", value: "12,456", unit: "SOL", icon: Trophy },
    { title: "Total Players", value: "45,621", unit: "", icon: Users },
    { title: "Active Lotteries", value: "8", unit: "", icon: Zap },
    { title: "Success Rate", value: "100", unit: "%", icon: TrendingUp },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background} ${themeConfig.text}`}>
      <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background.replace('from-slate-900', 'from-black/20')} backdrop-blur-sm`}>
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${themeConfig.primary} rounded-xl flex items-center justify-center`}>
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
                    SolanaLotto
                  </h1>
                  <p className="text-xs text-gray-400">Powered by Solana Blockchain</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                {/* Mobile Theme Switcher */}
                <div className="md:hidden">
                  <CompactThemeSwitcher />
                </div>
                
                {/* Desktop Theme Switcher */}
                <div className="hidden md:block">
                  <ThemeSwitcher />
                </div>
                
                <Button className={`bg-gradient-to-r ${themeConfig.primary} hover:opacity-90 transition-opacity`}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </motion.div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <motion.section 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <h2 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
                {currentLottery.prizePool} SOL
              </h2>
              <p className="text-xl text-gray-300">Current Prize Pool</p>
              <div className="flex items-center justify-center space-x-4 text-sm flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Timer className="w-3 h-3 mr-1" />
                  {currentLottery.timeLeft} left
                </Badge>
                <Badge variant="outline" className={`border-opacity-30 ${themeConfig.accent.replace('text-', 'border-').replace('-400', '-500')}`}>
                  <Users className="w-3 h-3 mr-1" />
                  {currentLottery.participants} players
                </Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                  <Ticket className="w-3 h-3 mr-1" />
                  {currentLottery.totalTickets}/{currentLottery.maxTickets} tickets
                </Badge>
              </div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section 
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {lotteryStats.map((stat, index) => (
              <Card key={index} className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${themeConfig.secondary}/20 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${themeConfig.accent}`} />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${themeConfig.text}`}>
                        {stat.value}
                        <span className="text-sm text-gray-400 ml-1">{stat.unit}</span>
                      </p>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Buy Tickets */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${themeConfig.text}`}>
                    <Ticket className={`w-5 h-5 mr-2 ${themeConfig.accent}`} />
                    Buy Lottery Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Number of Tickets</Label>
                      <span className="text-sm text-gray-400">
                        Price: {currentLottery.ticketPrice} SOL each
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setTicketAmount(Math.max(1, ticketAmount - 1))}
                        className={`border-opacity-30 hover:border-opacity-50 ${themeConfig.accent.replace('text-', 'border-').replace('-400', '-500')}`}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={ticketAmount}
                        onChange={(e) => setTicketAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className={`text-center ${themeConfig.cardBg} border-white/10 ${themeConfig.text}`}
                        min="1"
                        max="100"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setTicketAmount(Math.min(100, ticketAmount + 1))}
                        className={`border-opacity-30 hover:border-opacity-50 ${themeConfig.accent.replace('text-', 'border-').replace('-400', '-500')}`}
                      >
                        +
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      {[1, 5, 10, 25].map((amount) => (
                        <Button
                          key={amount}
                          variant={ticketAmount === amount ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTicketAmount(amount)}
                          className={ticketAmount === amount 
                            ? `bg-gradient-to-r ${themeConfig.primary}` 
                            : `border-opacity-30 hover:border-opacity-50 ${themeConfig.accent.replace('text-', 'border-').replace('-400', '-500')}`
                          }
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>

                    <div className={`${themeConfig.cardBg} rounded-lg p-4 border border-white/10`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Total Cost:</span>
                        <span className={`text-2xl font-bold ${themeConfig.text}`}>
                          {(ticketAmount * currentLottery.ticketPrice).toFixed(2)} SOL
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>Potential Win:</span>
                        <span className="text-green-400 font-semibold">
                          {currentLottery.prizePool.toFixed(2)} SOL
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className={`w-full bg-gradient-to-r ${themeConfig.primary} hover:opacity-90 transition-opacity text-white font-semibold py-6`}
                    >
                      <Coins className="w-5 h-5 mr-2" />
                      Buy {ticketAmount} Ticket{ticketAmount > 1 ? 's' : ''}
                    </Button>
                  </div>

                  <Alert className={`bg-opacity-10 border-opacity-30 ${themeConfig.accent.replace('text-', 'bg-').replace('-400', '-500')} ${themeConfig.accent.replace('text-', 'border-').replace('-400', '-500')}`}>
                    <Star className={`h-4 w-4 ${themeConfig.accent}`} />
                    <AlertDescription className={`${themeConfig.accent.replace('-400', '-200')}`}>
                      Your tickets are stored as NFTs on the Solana blockchain. 
                      Each ticket gives you a chance to win the entire prize pool!
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Lottery Progress */}
              <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className={themeConfig.text}>Lottery Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Tickets Sold</span>
                      <span className={themeConfig.text}>
                        {currentLottery.totalTickets} / {currentLottery.maxTickets}
                      </span>
                    </div>
                    <Progress 
                      value={(currentLottery.totalTickets / currentLottery.maxTickets) * 100} 
                      className="h-3 bg-white/10"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>12% filled</span>
                      <span>Drawing when 100% filled or timer expires</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Recent Winners & Info */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${themeConfig.text}`}>
                    <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                    Recent Winners
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {previousWinners.map((winner) => (
                    <div key={winner.id} className={`flex items-center space-x-3 p-3 ${themeConfig.cardBg} rounded-lg`}>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`bg-gradient-to-br ${themeConfig.primary} text-white text-xs`}>
                          {winner.address.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-gray-300">
                            {winner.address}
                          </span>
                          <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">
                            {winner.ticket}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-lg font-bold text-green-400">
                            {winner.amount} SOL
                          </span>
                          <span className="text-xs text-gray-500">{winner.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* How it Works */}
              <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className={themeConfig.text}>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { step: "1", title: "Buy Tickets", desc: "Purchase lottery tickets with SOL" },
                      { step: "2", title: "Wait for Draw", desc: "Random winner selected via Switchboard" },
                      { step: "3", title: "Win Prizes", desc: "Winner receives the entire prize pool" },
                      { step: "4", title: "NFT Tickets", desc: "Your tickets are minted as NFTs" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${themeConfig.primary} rounded-full flex items-center justify-center text-sm font-bold text-white`}>
                          {item.step}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${themeConfig.text}`}>{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Lottery Tabs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Tabs value={selectedLottery} onValueChange={setSelectedLottery} className="w-full">
              <TabsList className={`grid w-full grid-cols-3 ${themeConfig.cardBg} border border-white/10`}>
                <TabsTrigger value="active" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${themeConfig.primary.replace('from-', '').replace('to-', '')}`}>
                  Active Lotteries
                </TabsTrigger>
                <TabsTrigger value="history" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${themeConfig.primary.replace('from-', '').replace('to-', '')}`}>
                  History
                </TabsTrigger>
                <TabsTrigger value="my-tickets" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${themeConfig.primary.replace('from-', '').replace('to-', '')}`}>
                  My Tickets
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Mock active lotteries */}
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className={themeConfig.text}>Lottery #{i}</CardTitle>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className={`text-3xl font-bold ${themeConfig.text}`}>{(45.5 * i).toFixed(1)} SOL</p>
                            <p className="text-sm text-gray-400">Prize Pool</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Ticket Price:</span>
                              <span className={themeConfig.text}>0.1 SOL</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Time Left:</span>
                              <span className="text-green-400">{5 - i}h 23m</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Players:</span>
                              <span className={themeConfig.text}>{127 * i}</span>
                            </div>
                          </div>
                          <Button size="sm" className={`w-full bg-gradient-to-r ${themeConfig.primary} hover:opacity-90`}>
                            Join Lottery
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className={themeConfig.text}>Lottery History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {previousWinners.map((winner, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 ${themeConfig.cardBg} rounded-lg`}>
                          <div>
                            <p className="font-mono text-sm text-gray-300">{winner.address}</p>
                            <p className="text-xs text-gray-500">Ticket {winner.ticket} • {winner.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-400">{winner.amount} SOL</p>
                            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">
                              Winner
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="my-tickets" className="mt-6">
                <Card className={`${themeConfig.cardBg} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className={themeConfig.text}>My Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Ticket className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <h3 className={`text-xl font-semibold ${themeConfig.text} mb-2`}>No Tickets Yet</h3>
                      <p className="text-gray-400 mb-6">Buy your first ticket to start playing!</p>
                      <Button className={`bg-gradient-to-r ${themeConfig.primary} hover:opacity-90`}>
                        Buy Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
