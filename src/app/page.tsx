'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Eraser, Pencil, StickyNote } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 text-purple-800">Erasor Clone</h1>
        <p className="text-xl mb-8 text-gray-700">Your digital canvas for ideas and creativity</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-6 mb-12"
      >
        <Link href="/draw">
          <Button size="lg" className="w-48 h-16 text-lg flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700">
            <Pencil className="w-6 h-6" />
            Drawing Board
          </Button>
        </Link>
        <Link href="/notes">
          <Button size="lg" className="w-48 h-16 text-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
            <StickyNote className="w-6 h-6" />
            Notepad
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative w-64 h-64 sm:w-96 sm:h-96"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Eraser className="w-32 h-32 sm:w-48 sm:h-48 text-purple-500 opacity-30" />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
            delay: 0.5
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Pencil className="w-32 h-32 sm:w-48 sm:h-48 text-blue-500 opacity-30" />
        </motion.div>
      </motion.div>
    </main>
  )
}

