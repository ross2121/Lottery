"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 bg-white/10" />
            <Skeleton className="h-6 w-16 bg-white/10" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-24 mx-auto bg-white/10" />
            <Skeleton className="h-4 w-16 mx-auto bg-white/10" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 bg-white/10" />
              <Skeleton className="h-4 w-16 bg-white/10" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16 bg-white/10" />
              <Skeleton className="h-4 w-12 bg-white/10" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-14 bg-white/10" />
              <Skeleton className="h-4 w-10 bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-9 w-full bg-white/10" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LoadingTicket() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 bg-white/10" />
              <Skeleton className="h-6 w-16 bg-white/10" />
            </div>
            <div className="space-y-3">
              <div>
                <Skeleton className="h-3 w-16 mb-2 bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-3 w-16 mb-2 bg-white/10" />
                  <Skeleton className="h-4 w-20 bg-white/10" />
                </div>
                <div>
                  <Skeleton className="h-3 w-16 mb-2 bg-white/10" />
                  <Skeleton className="h-4 w-16 bg-white/10" />
                </div>
              </div>
              <div className="text-center py-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3] 
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-6 bg-purple-400/30 rounded-full mx-auto"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LoadingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-xl bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-16 bg-white/10" />
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 