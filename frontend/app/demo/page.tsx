"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TicketCard } from "@/components/lottery/ticket-card";
import { CountdownTimer, CompactCountdown } from "@/components/lottery/countdown-timer";
import { LoadingCard, LoadingTicket, LoadingStats } from "@/components/lottery/loading-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DemoPage() {
  const [showLoading, setShowLoading] = useState(false);
  
  // Demo data
  const mockTickets = [
    {
      ticketNumber: "0001",
      lotteryId: "DEMO-2024-001",
      status: "winner" as const,
      prizeAmount: 125.5,
      drawDate: "Dec 15, 2024",
      ticketId: "TKT001"
    },
    {
      ticketNumber: "0042",
      lotteryId: "DEMO-2024-002",
      status: "active" as const,
      drawDate: "Dec 20, 2024",
      ticketId: "TKT042"
    },
    {
      ticketNumber: "0035",
      lotteryId: "DEMO-2024-001",
      status: "expired" as const,
      drawDate: "Dec 10, 2024",
      ticketId: "TKT035"
    }
  ];

  const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  const nearFutureDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Component Demo
          </h1>
          <p className="text-xl text-gray-300">
            Showcasing all the beautiful lottery UI components
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setShowLoading(!showLoading)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {showLoading ? "Hide Loading States" : "Show Loading States"}
            </Button>
          </div>
        </motion.div>

        <Separator className="bg-white/10" />

        {/* Component Showcase */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="tickets" className="data-[state=active]:bg-purple-600">
              Ticket Cards
            </TabsTrigger>
            <TabsTrigger value="countdown" className="data-[state=active]:bg-purple-600">
              Countdown Timer
            </TabsTrigger>
            <TabsTrigger value="loading" className="data-[state=active]:bg-purple-600">
              Loading States
            </TabsTrigger>
            <TabsTrigger value="effects" className="data-[state=active]:bg-purple-600">
              Visual Effects
            </TabsTrigger>
          </TabsList>

          {/* Ticket Cards Demo */}
          <TabsContent value="tickets" className="mt-8 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Ticket Cards in Different States</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket.ticketId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <TicketCard {...ticket} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Different Badge States</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    ✨ Active
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    ⭐ Winner!
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    🔥 Final Hour!
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    ⚡ Hurry Up!
                  </Badge>
                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                    Expired
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Countdown Timer Demo */}
          <TabsContent value="countdown" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Full Countdown Timer</CardTitle>
                  <p className="text-gray-400">With 2 days remaining</p>
                </CardHeader>
                <CardContent>
                  <CountdownTimer endTime={futureDate} />
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Urgent Countdown</CardTitle>
                  <p className="text-gray-400">With 30 minutes remaining</p>
                </CardHeader>
                <CardContent>
                  <CountdownTimer endTime={nearFutureDate} />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Compact Countdown Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Lottery #1 ends in:</span>
                    <CompactCountdown endTime={futureDate} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Lottery #2 ends in:</span>
                    <CompactCountdown endTime={nearFutureDate} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loading States Demo */}
          <TabsContent value="loading" className="mt-8 space-y-6">
            {showLoading ? (
              <>
                <LoadingStats />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <LoadingTicket />
                  <LoadingTicket />
                  <LoadingTicket />
                </div>
              </>
            ) : (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Loading State Demo
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Click "Show Loading States" to see skeleton animations
                  </p>
                  <Button
                    onClick={() => setShowLoading(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Show Loading States
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Visual Effects Demo */}
          <TabsContent value="effects" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Text Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Rainbow Text</h4>
                    <p className="text-2xl font-bold text-rainbow">
                      JACKPOT WINNER!
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Glowing Text</h4>
                    <p className="text-2xl font-bold text-glow text-purple-400">
                      125.5 SOL
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Gradient Text</h4>
                    <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      SolanaLotto
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Button Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 btn-glow">
                    Glowing Button
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 pulse-glow">
                    Pulsing Button
                  </Button>
                  <Button className="w-full bg-white/10 border border-white/20 shimmer ticket-shine">
                    Shine Effect Button
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Animation Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="text-sm text-gray-400 mb-4">Float Animation</h4>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto float"></div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm text-gray-400 mb-4">Glow Animation</h4>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto glow"></div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm text-gray-400 mb-4">Pulse Glow</h4>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto pulse-glow"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center space-y-4 pt-8"
        >
          <Separator className="bg-white/10" />
          <p className="text-gray-400">
            All components are built with <span className="text-purple-400">shadcn/ui</span>, 
            <span className="text-pink-400"> Framer Motion</span>, and 
            <span className="text-yellow-400"> Tailwind CSS</span>
          </p>
          <p className="text-sm text-gray-500">
            Ready for your Solana lottery integration!
          </p>
        </motion.div>
      </div>
    </div>
  );
} 