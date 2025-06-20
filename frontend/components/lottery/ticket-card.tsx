"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Ticket, Gift } from "lucide-react";

interface TicketCardProps {
  ticketNumber: string;
  lotteryId: string;
  status: "active" | "winner" | "expired";
  prizeAmount?: number;
  drawDate: string;
  ticketId: string;
}

export function TicketCard({
  ticketNumber,
  lotteryId,
  status,
  prizeAmount,
  drawDate,
  ticketId,
}: TicketCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "winner":
        return "from-yellow-500 to-orange-500";
      case "active":
        return "from-purple-500 to-pink-500";
      case "expired":
        return "from-gray-500 to-gray-600";
      default:
        return "from-purple-500 to-pink-500";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "winner":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Star className="w-3 h-3 mr-1" />
            Winner!
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Expired
          </Badge>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden relative">
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor()} opacity-10`} />
        
        {/* Ticket pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern
                id="ticket-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#ticket-pattern)" />
          </svg>
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-purple-400" />
                <span className="font-mono text-sm text-gray-300">#{ticketNumber}</span>
              </div>
              {getStatusBadge()}
            </div>

            {/* Ticket Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Lottery ID</p>
                <p className="font-mono text-white">{lotteryId}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Draw Date</p>
                  <p className="text-sm text-white">{drawDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Ticket ID</p>
                  <p className="text-sm font-mono text-white">{ticketId}</p>
                </div>
              </div>

              {status === "winner" && prizeAmount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4 text-center"
                >
                  <Gift className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                  <p className="text-sm text-yellow-400 mb-1">Congratulations!</p>
                  <p className="text-2xl font-bold text-white">{prizeAmount} SOL</p>
                  <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                    Claim Prize
                  </Button>
                </motion.div>
              )}

              {status === "active" && (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-400">Waiting for draw...</p>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 bg-purple-400 rounded-full mx-auto mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Decorative corner elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full" />
      </Card>
    </motion.div>
  );
} 