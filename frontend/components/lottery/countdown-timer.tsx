"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";

interface CountdownTimerProps {
  endTime: Date;
  onExpire?: () => void;
}

interface TimeUnit {
  value: number;
  label: string;
}

export function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = endTime.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        onExpire?.();
        return [];
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return [
        { value: days, label: "Days" },
        { value: hours, label: "Hours" },
        { value: minutes, label: "Minutes" },
        { value: seconds, label: "Seconds" },
      ];
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (isExpired) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-12 h-12 mx-auto text-red-400 mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Lottery Ended!</h3>
            <p className="text-gray-300">Drawing in progress...</p>
            <Badge className="mt-4 bg-red-500/20 text-red-400 border-red-500/30">
              Expired
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Time Remaining</h3>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {timeLeft.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <motion.div
                    key={unit.value} // Key ensures animation triggers on value change
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 md:p-4"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                      {unit.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">
                      {unit.label}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Urgency indicator */}
            {timeLeft.length > 0 && (
              <motion.div
                animate={{
                  opacity: timeLeft[0]?.value === 0 && timeLeft[1]?.value < 1 ? [0.5, 1, 0.5] : 1
                }}
                transition={{ duration: 1, repeat: timeLeft[0]?.value === 0 && timeLeft[1]?.value < 1 ? Infinity : 0 }}
              >
                <Badge 
                  className={`${
                    timeLeft[0]?.value === 0 && timeLeft[1]?.value < 1
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : timeLeft[0]?.value === 0 && timeLeft[1]?.value < 6
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30"
                  }`}
                >
                  {timeLeft[0]?.value === 0 && timeLeft[1]?.value < 1
                    ? "🔥 Final Hour!"
                    : timeLeft[0]?.value === 0 && timeLeft[1]?.value < 6
                    ? "⚡ Hurry Up!"
                    : "✨ Active"}
                </Badge>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Compact version for smaller spaces
export function CompactCountdown({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const target = endTime.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    const timer = setInterval(updateTimer, 60000); // Update every minute
    updateTimer();

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <span className="font-mono text-sm">
      {timeLeft}
    </span>
  );
} 