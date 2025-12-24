/**
 * Express Server for API Routes
 * This server handles API endpoints for the Vite frontend
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRouter from './api/chat.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DevHub API Server is running' })
})

// API Routes
app.use('/api', chatRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 DevHub API Server running on http://localhost:${PORT}`)
  console.log(`📡 Chat endpoint: http://localhost:${PORT}/api/chat`)
})

